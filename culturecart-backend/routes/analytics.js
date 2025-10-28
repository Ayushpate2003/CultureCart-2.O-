const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics (authenticated admin only)
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access analytics'
      });
    }

    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // User statistics
    const userStats = await query(`
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN roles::jsonb ? 'buyer' THEN 1 END) as total_buyers,
        COUNT(CASE WHEN roles::jsonb ? 'artisan' THEN 1 END) as total_artisans,
        COUNT(CASE WHEN created_at >= $1 THEN 1 END) as new_users_period
      FROM users
    `, [startDate]);

    // Product statistics
    const productStats = await query(`
      SELECT
        COUNT(*) as total_products,
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published_products,
        COUNT(CASE WHEN created_at >= $1 THEN 1 END) as new_products_period,
        AVG(CASE WHEN stats->>'averageRating' != 'null' THEN (stats->>'averageRating')::float END) as avg_rating
      FROM products
    `, [startDate]);

    // Order statistics
    const orderStats = await query(`
      SELECT
        COUNT(*) as total_orders,
        COUNT(CASE WHEN order_status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN created_at >= $1 THEN 1 END) as orders_period,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN created_at >= $1 THEN total_amount END), 0) as revenue_period
      FROM orders
    `, [startDate]);

    // Artisan statistics
    const artisanStats = await query(`
      SELECT
        COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified_artisans,
        AVG(rating) as avg_artisan_rating,
        COUNT(CASE WHEN created_at >= $1 THEN 1 END) as new_artisans_period
      FROM artisans
    `, [startDate]);

    // Revenue by category
    const revenueByCategory = await query(`
      SELECT
        p.category,
        COALESCE(SUM(oi.total), 0) as revenue
      FROM products p
      LEFT JOIN (
        SELECT
          (item->>'productId')::text as product_id,
          SUM((item->>'price')::float * (item->>'quantity')::int) as total
        FROM orders o,
        LATERAL jsonb_array_elements(o.items) as item
        WHERE o.order_status = 'completed'
        GROUP BY (item->>'productId')::text
      ) oi ON p.product_id = oi.product_id
      GROUP BY p.category
      ORDER BY revenue DESC
      LIMIT 10
    `);

    // Top performing products
    const topProducts = await query(`
      SELECT
        p.product_id,
        p.title,
        p.images,
        COALESCE(SUM(oi.quantity), 0) as total_sales,
        COALESCE(SUM(oi.total), 0) as total_revenue,
        p.stats->>'averageRating' as rating
      FROM products p
      LEFT JOIN (
        SELECT
          (item->>'productId')::text as product_id,
          SUM((item->>'quantity')::int) as quantity,
          SUM((item->>'price')::float * (item->>'quantity')::int) as total
        FROM orders o,
        LATERAL jsonb_array_elements(o.items) as item
        WHERE o.order_status = 'completed' AND o.created_at >= $1
        GROUP BY (item->>'productId')::text
      ) oi ON p.product_id = oi.product_id
      GROUP BY p.product_id, p.title, p.images, p.stats
      ORDER BY total_revenue DESC
      LIMIT 10
    `, [startDate]);

    // Recent orders
    const recentOrders = await query(`
      SELECT
        o.order_id,
        o.order_number,
        o.total_amount,
        o.order_status,
        o.created_at,
        u.email as buyer_email
      FROM orders o
      JOIN users u ON o.buyer_id = u.user_id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    const analytics = {
      overview: {
        totalUsers: parseInt(userStats.rows[0].total_users),
        totalBuyers: parseInt(userStats.rows[0].total_buyers),
        totalArtisans: parseInt(userStats.rows[0].total_artisans),
        totalProducts: parseInt(productStats.rows[0].total_products),
        publishedProducts: parseInt(productStats.rows[0].published_products),
        totalOrders: parseInt(orderStats.rows[0].total_orders),
        completedOrders: parseInt(orderStats.rows[0].completed_orders),
        totalRevenue: parseFloat(orderStats.rows[0].total_revenue),
        verifiedArtisans: parseInt(artisanStats.rows[0].verified_artisans),
        avgRating: Math.round((parseFloat(productStats.rows[0].avg_rating) || 0) * 10) / 10,
        avgArtisanRating: Math.round((parseFloat(artisanStats.rows[0].avg_artisan_rating) || 0) * 10) / 10
      },
      period: {
        newUsers: parseInt(userStats.rows[0].new_users_period),
        newProducts: parseInt(productStats.rows[0].new_products_period),
        newOrders: parseInt(orderStats.rows[0].orders_period),
        newRevenue: parseFloat(orderStats.rows[0].revenue_period),
        newArtisans: parseInt(artisanStats.rows[0].new_artisans_period)
      },
      revenueByCategory: revenueByCategory.rows.map(row => ({
        category: row.category,
        revenue: parseFloat(row.revenue)
      })),
      topProducts: topProducts.rows.map(row => ({
        productId: row.product_id,
        title: row.title,
        images: row.images,
        totalSales: parseInt(row.total_sales),
        totalRevenue: parseFloat(row.total_revenue),
        rating: parseFloat(row.rating) || 0
      })),
      recentOrders: recentOrders.rows.map(row => ({
        orderId: row.order_id,
        orderNumber: row.order_number,
        totalAmount: parseFloat(row.total_amount),
        status: row.order_status,
        createdAt: row.created_at,
        buyerEmail: row.buyer_email
      }))
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Get artisan analytics (authenticated artisan only)
router.get('/artisan', authenticateToken, async (req, res) => {
  try {
    // Check if user is an artisan
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can access artisan analytics'
      });
    }

    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Product performance
    const productPerformance = await query(`
      SELECT
        p.product_id,
        p.title,
        p.images,
        COALESCE(SUM(oi.quantity), 0) as sales_count,
        COALESCE(SUM(oi.total), 0) as revenue,
        p.stats->>'averageRating' as rating,
        p.stats->>'reviewCount' as review_count
      FROM products p
      LEFT JOIN (
        SELECT
          (item->>'productId')::text as product_id,
          SUM((item->>'quantity')::int) as quantity,
          SUM((item->>'price')::float * (item->>'quantity')::int) as total
        FROM orders o,
        LATERAL jsonb_array_elements(o.items) as item
        WHERE o.order_status = 'completed' AND o.created_at >= $1
        GROUP BY (item->>'productId')::text
      ) oi ON p.product_id = oi.product_id
      WHERE p.artisan_id = $2
      GROUP BY p.product_id, p.title, p.images, p.stats
      ORDER BY revenue DESC
    `, [startDate, req.user.user_id]);

    // Sales overview
    const salesOverview = await query(`
      SELECT
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(oi.total), 0) as total_revenue,
        AVG(oi.total) as avg_order_value
      FROM orders o
      LEFT JOIN LATERAL (
        SELECT SUM((item->>'price')::float * (item->>'quantity')::int) as total
        FROM jsonb_array_elements(o.items) as item
        WHERE (item->>'artisanId')::text = $1
      ) oi ON true
      WHERE o.order_status = 'completed' AND o.created_at >= $2 AND oi.total IS NOT NULL
    `, [req.user.user_id, startDate]);

    // Monthly sales trend
    const monthlyTrend = await query(`
      SELECT
        DATE_TRUNC('month', o.created_at) as month,
        COUNT(DISTINCT o.id) as orders,
        COALESCE(SUM(oi.total), 0) as revenue
      FROM orders o
      LEFT JOIN LATERAL (
        SELECT SUM((item->>'price')::float * (item->>'quantity')::int) as total
        FROM jsonb_array_elements(o.items) as item
        WHERE (item->>'artisanId')::text = $1
      ) oi ON true
      WHERE o.order_status = 'completed' AND o.created_at >= $2 AND oi.total IS NOT NULL
      GROUP BY DATE_TRUNC('month', o.created_at)
      ORDER BY month DESC
      LIMIT 12
    `, [req.user.user_id, new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)]);

    const analytics = {
      productPerformance: productPerformance.rows.map(row => ({
        productId: row.product_id,
        title: row.title,
        images: row.images,
        salesCount: parseInt(row.sales_count),
        revenue: parseFloat(row.revenue),
        rating: parseFloat(row.rating) || 0,
        reviewCount: parseInt(row.review_count) || 0
      })),
      salesOverview: {
        totalOrders: parseInt(salesOverview.rows[0]?.total_orders || 0),
        totalRevenue: parseFloat(salesOverview.rows[0]?.total_revenue || 0),
        avgOrderValue: parseFloat(salesOverview.rows[0]?.avg_order_value || 0)
      },
      monthlyTrend: monthlyTrend.rows.map(row => ({
        month: row.month,
        orders: parseInt(row.orders),
        revenue: parseFloat(row.revenue)
      }))
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get artisan analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Get buyer analytics (authenticated buyer only)
router.get('/buyer', authenticateToken, async (req, res) => {
  try {
    // Check if user is a buyer
    if (!req.user.roles.includes('buyer')) {
      return res.status(403).json({
        success: false,
        message: 'Only buyers can access buyer analytics'
      });
    }

    // Order history summary
    const orderSummary = await query(`
      SELECT
        COUNT(*) as total_orders,
        COUNT(CASE WHEN order_status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
        COALESCE(SUM(total_amount), 0) as total_spent,
        AVG(total_amount) as avg_order_value,
        MAX(created_at) as last_order_date
      FROM orders
      WHERE buyer_id = $1
    `, [req.user.user_id]);

    // Favorite categories
    const favoriteCategories = await query(`
      SELECT
        p.category,
        COUNT(*) as order_count,
        SUM((item->>'quantity')::int) as total_quantity
      FROM orders o,
      LATERAL jsonb_array_elements(o.items) as item
      JOIN products p ON (item->>'productId')::text = p.product_id
      WHERE o.buyer_id = $1 AND o.order_status = 'completed'
      GROUP BY p.category
      ORDER BY order_count DESC
      LIMIT 5
    `, [req.user.user_id]);

    // Recent orders
    const recentOrders = await query(`
      SELECT
        o.order_id,
        o.order_number,
        o.total_amount,
        o.order_status,
        o.created_at,
        COUNT(item) as item_count
      FROM orders o,
      LATERAL jsonb_array_elements(o.items) as item
      WHERE o.buyer_id = $1
      GROUP BY o.id, o.order_id, o.order_number, o.total_amount, o.order_status, o.created_at
      ORDER BY o.created_at DESC
      LIMIT 10
    `, [req.user.user_id]);

    const analytics = {
      orderSummary: {
        totalOrders: parseInt(orderSummary.rows[0]?.total_orders || 0),
        completedOrders: parseInt(orderSummary.rows[0]?.completed_orders || 0),
        pendingOrders: parseInt(orderSummary.rows[0]?.pending_orders || 0),
        totalSpent: parseFloat(orderSummary.rows[0]?.total_spent || 0),
        avgOrderValue: parseFloat(orderSummary.rows[0]?.avg_order_value || 0),
        lastOrderDate: orderSummary.rows[0]?.last_order_date
      },
      favoriteCategories: favoriteCategories.rows.map(row => ({
        category: row.category,
        orderCount: parseInt(row.order_count),
        totalQuantity: parseInt(row.total_quantity)
      })),
      recentOrders: recentOrders.rows.map(row => ({
        orderId: row.order_id,
        orderNumber: row.order_number,
        totalAmount: parseFloat(row.total_amount),
        status: row.order_status,
        createdAt: row.created_at,
        itemCount: parseInt(row.item_count)
      }))
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get buyer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

module.exports = router;
