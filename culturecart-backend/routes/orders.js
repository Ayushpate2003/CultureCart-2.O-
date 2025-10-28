const express = require('express');
const { query, getClient } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate, orderSchemas } = require('../middleware/validation');

const router = express.Router();

// Create order (authenticated buyer only)
router.post('/', authenticateToken, validate(orderSchemas.create), async (req, res) => {
  try {
    const orderData = req.body;

    // Check if user is a buyer
    if (!req.user.roles.includes('buyer')) {
      return res.status(403).json({
        success: false,
        message: 'Only buyers can create orders'
      });
    }

    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Generate order IDs
      const orderId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const orderNumber = 'CC-' + Date.now();

      // Calculate totals
      let subtotal = 0;
      let tax = 0;
      const shipping = orderData.shipping || 0;
      const discount = orderData.discount || 0;

      // Validate and calculate item totals
      for (const item of orderData.items) {
        const productResult = await client.query(
          'SELECT price, stock_quantity FROM products WHERE product_id = $1 AND status = $2',
          [item.productId, 'published']
        );

        if (productResult.rows.length === 0) {
          throw new Error(`Product ${item.productId} not found or not available`);
        }

        const product = productResult.rows[0];
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        subtotal += product.price * item.quantity;
      }

      const totalAmount = subtotal + tax + shipping - discount;

      // Create order
      const orderResult = await client.query(`
        INSERT INTO orders (
          order_id, order_number, buyer_id, items, subtotal, tax, shipping,
          discount, total_amount, currency, order_status, payment_status,
          shipping_address, billing_address, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        orderId,
        orderNumber,
        req.user.user_id,
        JSON.stringify(orderData.items),
        subtotal,
        tax,
        shipping,
        discount,
        totalAmount,
        orderData.currency || 'INR',
        'pending',
        'pending',
        JSON.stringify(orderData.shippingAddress),
        JSON.stringify(orderData.billingAddress || orderData.shippingAddress),
        orderData.notes || null
      ]);

      const newOrder = orderResult.rows[0];

      // Update product stock quantities
      for (const item of orderData.items) {
        await client.query(`
          UPDATE products
          SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP
          WHERE product_id = $2
        `, [item.quantity, item.productId]);

        // Update product sales stats
        await client.query(`
          UPDATE products
          SET stats = jsonb_set(
            jsonb_set(
              COALESCE(stats, '{}'),
              '{salesCount}',
              ((COALESCE(stats->>'salesCount', '0'))::int + $1)::text()::jsonb
            ),
            '{updatedAt}',
            to_jsonb(CURRENT_TIMESTAMP)
          ),
          updated_at = CURRENT_TIMESTAMP
          WHERE product_id = $2
        `, [item.quantity, item.productId]);
      }

      // Update artisan stats
      const uniqueArtisanIds = [...new Set(orderData.items.map(item => item.artisanId))];
      for (const artisanId of uniqueArtisanIds) {
        const artisanItems = orderData.items.filter(item => item.artisanId === artisanId);
        const artisanRevenue = artisanItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await client.query(`
          UPDATE artisans
          SET total_sales = total_sales + 1,
              total_revenue = total_revenue + $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $2
        `, [artisanRevenue, artisanId]);
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          orderId: newOrder.order_id,
          orderNumber: newOrder.order_number,
          totalAmount: newOrder.total_amount,
          status: newOrder.order_status,
          createdAt: newOrder.created_at
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
});

// Get user's orders (authenticated user)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT
        id, order_id, order_number, buyer_id, items, subtotal, tax, shipping,
        discount, total_amount, currency, order_status, payment_status,
        payment_method, payment_id, shipping_address, billing_address,
        tracking_number, estimated_delivery, delivered_at, notes,
        created_at, updated_at
      FROM orders
      WHERE buyer_id = $1
    `;

    const params = [req.user.user_id];
    if (status) {
      sql += ' AND order_status = $2';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';
    sql += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);

    const orders = result.rows.map(order => ({
      id: order.id,
      orderId: order.order_id,
      orderNumber: order.order_number,
      buyerId: order.buyer_id,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      totalAmount: order.total_amount,
      currency: order.currency,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      paymentId: order.payment_id,
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      trackingNumber: order.tracking_number,
      estimatedDelivery: order.estimated_delivery,
      deliveredAt: order.delivered_at,
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    res.json({
      success: true,
      data: orders,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: result.rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get order by ID (authenticated user)
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await query(`
      SELECT
        o.id, o.order_id, o.order_number, o.buyer_id, o.items, o.subtotal, o.tax, o.shipping,
        o.discount, o.total_amount, o.currency, o.order_status, o.payment_status,
        o.payment_method, o.payment_id, o.shipping_address, o.billing_address,
        o.tracking_number, o.estimated_delivery, o.delivered_at, o.notes,
        o.created_at, o.updated_at,
        json_agg(
          json_build_object(
            'productId', p.product_id,
            'title', p.title,
            'images', p.images,
            'artisanName', a.full_name,
            'artisanId', a.user_id
          )
        ) as product_details
      FROM orders o
      LEFT JOIN LATERAL jsonb_array_elements(o.items) as item ON true
      LEFT JOIN products p ON (item->>'productId')::text = p.product_id
      LEFT JOIN artisans a ON p.artisan_id = a.user_id
      WHERE o.order_id = $1 AND o.buyer_id = $2
      GROUP BY o.id, o.order_id, o.order_number, o.buyer_id, o.items, o.subtotal, o.tax,
               o.shipping, o.discount, o.total_amount, o.currency, o.order_status,
               o.payment_status, o.payment_method, o.payment_id, o.shipping_address,
               o.billing_address, o.tracking_number, o.estimated_delivery, o.delivered_at,
               o.notes, o.created_at, o.updated_at
    `, [orderId, req.user.user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = result.rows[0];

    const transformedOrder = {
      id: order.id,
      orderId: order.order_id,
      orderNumber: order.order_number,
      buyerId: order.buyer_id,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      totalAmount: order.total_amount,
      currency: order.currency,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      paymentId: order.payment_id,
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      trackingNumber: order.tracking_number,
      estimatedDelivery: order.estimated_delivery,
      deliveredAt: order.delivered_at,
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      productDetails: order.product_details
    };

    res.json({
      success: true,
      data: transformedOrder
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Update order status (authenticated admin or artisan)
router.put('/:orderId/status', authenticateToken, validate(orderSchemas.updateStatus), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    // Check permissions - admin can update any order, artisans can only update their products' orders
    let orderCheckSql;
    let orderCheckParams;

    if (req.user.roles.includes('admin')) {
      orderCheckSql = 'SELECT id, buyer_id FROM orders WHERE order_id = $1';
      orderCheckParams = [orderId];
    } else if (req.user.roles.includes('artisan')) {
      // Artisans can only update orders containing their products
      orderCheckSql = `
        SELECT DISTINCT o.id, o.buyer_id
        FROM orders o
        LEFT JOIN LATERAL jsonb_array_elements(o.items) as item ON true
        LEFT JOIN products p ON (item->>'productId')::text = p.product_id
        WHERE o.order_id = $1 AND p.artisan_id = $2
      `;
      orderCheckParams = [orderId, req.user.user_id];
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update order status'
      });
    }

    const orderCheck = await query(orderCheckSql, orderCheckParams);

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied'
      });
    }

    const updateFields = ['order_status = $1'];
    const params = [status];
    let paramCount = 2;

    if (trackingNumber) {
      updateFields.push(`tracking_number = $${paramCount++}`);
      params.push(trackingNumber);
    }

    if (status === 'delivered') {
      updateFields.push(`delivered_at = CURRENT_TIMESTAMP`);
    }

    const sql = `
      UPDATE orders
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = $${paramCount}
      RETURNING order_id, order_status, tracking_number, delivered_at, updated_at
    `;
    params.push(orderId);

    const result = await query(sql, params);
    const updatedOrder = result.rows[0];

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderId: updatedOrder.order_id,
        status: updatedOrder.order_status,
        trackingNumber: updatedOrder.tracking_number,
        deliveredAt: updatedOrder.delivered_at,
        updatedAt: updatedOrder.updated_at
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Cancel order (authenticated buyer only)
router.put('/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if user owns this order
    const orderCheck = await query(
      'SELECT order_status FROM orders WHERE order_id = $1 AND buyer_id = $2',
      [orderId, req.user.user_id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const currentStatus = orderCheck.rows[0].order_status;

    // Only allow cancellation of pending or confirmed orders
    if (!['pending', 'confirmed'].includes(currentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Update order status
      await client.query(`
        UPDATE orders
        SET order_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $1
        RETURNING items
      `, [orderId]);

      // Restore product stock quantities
      const orderItems = orderCheck.rows[0].items;
      for (const item of orderItems) {
        await client.query(`
          UPDATE products
          SET stock_quantity = stock_quantity + $1, updated_at = CURRENT_TIMESTAMP
          WHERE product_id = $2
        `, [item.quantity, item.productId]);
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
});

module.exports = router;
