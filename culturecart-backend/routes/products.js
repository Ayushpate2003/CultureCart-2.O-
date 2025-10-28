const express = require('express');
const { query, getClient } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate, productSchemas } = require('../middleware/validation');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      craft_tradition,
      min_price,
      max_price,
      state,
      featured,
      status = 'published',
      sort_by = 'newest',
      limit = 20,
      offset = 0
    } = req.query;

    let sql = `
      SELECT
        p.id,
        p.product_id,
        p.artisan_id,
        p.title,
        p.description,
        p.ai_description,
        p.category,
        p.craft_tradition,
        p.price,
        p.currency,
        p.images,
        p.ai_images,
        p.video_url,
        p.model_3d_url,
        p.stock_quantity,
        p.min_order_quantity,
        p.dimensions,
        p.weight,
        p.materials,
        p.colors,
        p.tags,
        p.featured,
        p.eco_friendly,
        p.handmade,
        p.customizable,
        p.status,
        p.seo,
        p.stats,
        p.published_at,
        p.created_at,
        p.updated_at,
        a.full_name as artisan_name,
        a.location->>'state' as artisan_state,
        a.rating as artisan_rating
      FROM products p
      JOIN artisans a ON p.artisan_id = a.user_id
      WHERE p.status = $1 AND a.verification_status = 'verified'
    `;

    const params = [status];
    const conditions = [];

    if (search) {
      conditions.push('(p.title ILIKE $' + (params.length + 1) + ' OR p.description ILIKE $' + (params.length + 1) + ')');
      params.push(`%${search}%`);
    }

    if (category) {
      conditions.push('p.category = $' + (params.length + 1));
      params.push(category);
    }

    if (craft_tradition) {
      conditions.push('p.craft_tradition = $' + (params.length + 1));
      params.push(craft_tradition);
    }

    if (min_price) {
      conditions.push('p.price >= $' + (params.length + 1));
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      conditions.push('p.price <= $' + (params.length + 1));
      params.push(parseFloat(max_price));
    }

    if (state) {
      conditions.push('a.location->>\'state\' = $' + (params.length + 1));
      params.push(state);
    }

    if (featured === 'true') {
      conditions.push('p.featured = true');
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }

    // Sorting
    switch (sort_by) {
      case 'price_asc':
        sql += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        sql += ' ORDER BY p.price DESC';
        break;
      case 'rating':
        sql += ' ORDER BY p.stats->>\'averageRating\' DESC';
        break;
      case 'popular':
        sql += ' ORDER BY p.stats->>\'salesCount\' DESC';
        break;
      case 'newest':
      default:
        sql += ' ORDER BY p.created_at DESC';
    }

    sql += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);

    // Transform data to match frontend expectations
    const products = result.rows.map(product => ({
      id: product.id,
      productId: product.product_id,
      artisanId: product.artisan_id,
      title: product.title,
      description: product.description,
      aiDescription: product.ai_description,
      category: product.category,
      craftTradition: product.craft_tradition,
      price: product.price,
      currency: product.currency,
      images: product.images,
      aiImages: product.ai_images,
      videoUrl: product.video_url,
      model3dUrl: product.model_3d_url,
      stockQuantity: product.stock_quantity,
      minOrderQuantity: product.min_order_quantity,
      dimensions: product.dimensions,
      weight: product.weight,
      materials: product.materials,
      colors: product.colors,
      tags: product.tags,
      featured: product.featured,
      ecoFriendly: product.eco_friendly,
      handmade: product.handmade,
      customizable: product.customizable,
      status: product.status,
      seo: product.seo,
      stats: product.stats,
      publishedAt: product.published_at,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      artisan: {
        name: product.artisan_name,
        state: product.artisan_state,
        rating: product.artisan_rating
      }
    }));

    res.json({
      success: true,
      data: products,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: result.rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Get product by ID (public)
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await query(`
      SELECT
        p.id,
        p.product_id,
        p.artisan_id,
        p.title,
        p.description,
        p.ai_description,
        p.category,
        p.craft_tradition,
        p.price,
        p.currency,
        p.images,
        p.ai_images,
        p.video_url,
        p.model_3d_url,
        p.stock_quantity,
        p.min_order_quantity,
        p.dimensions,
        p.weight,
        p.materials,
        p.colors,
        p.tags,
        p.featured,
        p.eco_friendly,
        p.handmade,
        p.customizable,
        p.status,
        p.seo,
        p.stats,
        p.published_at,
        p.created_at,
        p.updated_at,
        a.full_name as artisan_name,
        a.location as artisan_location,
        a.rating as artisan_rating,
        a.bio as artisan_bio,
        a.portfolio as artisan_portfolio
      FROM products p
      JOIN artisans a ON p.artisan_id = a.user_id
      WHERE p.product_id = $1 AND p.status = 'published' AND a.verification_status = 'verified'
    `, [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = result.rows[0];

    // Update view count
    await query(`
      UPDATE products
      SET stats = jsonb_set(
        COALESCE(stats, '{}'),
        '{views}',
        ((COALESCE(stats->>'views', '0'))::int + 1)::text()::jsonb
      ),
      updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $1
    `, [productId]);

    // Transform data
    const transformedProduct = {
      id: product.id,
      productId: product.product_id,
      artisanId: product.artisan_id,
      title: product.title,
      description: product.description,
      aiDescription: product.ai_description,
      category: product.category,
      craftTradition: product.craft_tradition,
      price: product.price,
      currency: product.currency,
      images: product.images,
      aiImages: product.ai_images,
      videoUrl: product.video_url,
      model3dUrl: product.model_3d_url,
      stockQuantity: product.stock_quantity,
      minOrderQuantity: product.min_order_quantity,
      dimensions: product.dimensions,
      weight: product.weight,
      materials: product.materials,
      colors: product.colors,
      tags: product.tags,
      featured: product.featured,
      ecoFriendly: product.eco_friendly,
      handmade: product.handmade,
      customizable: product.customizable,
      status: product.status,
      seo: product.seo,
      stats: {
        ...product.stats,
        views: (product.stats?.views || 0) + 1
      },
      publishedAt: product.published_at,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      artisan: {
        id: product.artisan_id,
        name: product.artisan_name,
        location: product.artisan_location,
        rating: product.artisan_rating,
        bio: product.artisan_bio,
        portfolio: product.artisan_portfolio
      }
    };

    res.json({
      success: true,
      data: transformedProduct
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Create product (authenticated artisan only)
router.post('/', authenticateToken, validate(productSchemas.create), async (req, res) => {
  try {
    const productData = req.body;

    // Check if user is an artisan
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can create products'
      });
    }

    // Verify artisan exists and is verified
    const artisanCheck = await query(
      'SELECT verification_status FROM artisans WHERE user_id = $1',
      [req.user.user_id]
    );

    if (artisanCheck.rows.length === 0 || artisanCheck.rows[0].verification_status !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Artisan profile not found or not verified'
      });
    }

    // Generate product ID
    const productId = 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    const result = await query(`
      INSERT INTO products (
        product_id, artisan_id, title, description, ai_description, category,
        craft_tradition, price, currency, images, ai_images, video_url,
        model_3d_url, stock_quantity, min_order_quantity, dimensions,
        weight, materials, colors, tags, featured, eco_friendly,
        handmade, customizable, status, seo, stats
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
      )
      RETURNING *
    `, [
      productId,
      req.user.user_id,
      productData.title,
      productData.description,
      productData.aiDescription || null,
      productData.category,
      productData.craftTradition,
      productData.price,
      productData.currency || 'INR',
      JSON.stringify(productData.images || []),
      JSON.stringify(productData.aiImages || []),
      productData.videoUrl || null,
      productData.model3dUrl || null,
      productData.stockQuantity || 0,
      productData.minOrderQuantity || 1,
      productData.dimensions ? JSON.stringify(productData.dimensions) : null,
      productData.weight ? JSON.stringify(productData.weight) : null,
      JSON.stringify(productData.materials || []),
      JSON.stringify(productData.colors || []),
      JSON.stringify(productData.tags || []),
      productData.featured || false,
      productData.ecoFriendly || false,
      productData.handmade !== false, // Default to true
      productData.customizable || false,
      productData.status || 'draft',
      JSON.stringify(productData.seo || {}),
      JSON.stringify({
        views: 0,
        likes: 0,
        salesCount: 0,
        averageRating: 0,
        reviewCount: 0
      })
    ]);

    const newProduct = result.rows[0];

    // Update artisan's total_products count
    await query(`
      UPDATE artisans
      SET total_products = total_products + 1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [req.user.user_id]);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: newProduct.id,
        productId: newProduct.product_id,
        title: newProduct.title,
        status: newProduct.status,
        createdAt: newProduct.created_at
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// Update product (authenticated artisan only)
router.put('/:productId', authenticateToken, validate(productSchemas.update), async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    // Check if user is an artisan and owns this product
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can update products'
      });
    }

    // Verify product ownership
    const ownershipCheck = await query(
      'SELECT id FROM products WHERE product_id = $1 AND artisan_id = $2',
      [productId, req.user.user_id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Product not found or access denied'
      });
    }

    const updateFields = [];
    const params = [];
    let paramCount = 1;

    // Build dynamic update query
    const fieldMapping = {
      title: 'title',
      description: 'description',
      aiDescription: 'ai_description',
      category: 'category',
      craftTradition: 'craft_tradition',
      price: 'price',
      currency: 'currency',
      images: 'images',
      aiImages: 'ai_images',
      videoUrl: 'video_url',
      model3dUrl: 'model_3d_url',
      stockQuantity: 'stock_quantity',
      minOrderQuantity: 'min_order_quantity',
      dimensions: 'dimensions',
      weight: 'weight',
      materials: 'materials',
      colors: 'colors',
      tags: 'tags',
      featured: 'featured',
      ecoFriendly: 'eco_friendly',
      handmade: 'handmade',
      customizable: 'customizable',
      status: 'status',
      seo: 'seo'
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (fieldMapping[key]) {
        updateFields.push(`${fieldMapping[key]} = $${paramCount++}`);
        if (typeof value === 'object' && value !== null) {
          params.push(JSON.stringify(value));
        } else {
          params.push(value);
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const sql = `
      UPDATE products
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $${paramCount}
      RETURNING *
    `;
    params.push(productId);

    const result = await query(sql, params);
    const updatedProduct = result.rows[0];

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        productId: updatedProduct.product_id,
        title: updatedProduct.title,
        status: updatedProduct.status,
        updatedAt: updatedProduct.updated_at
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// Delete product (authenticated artisan only)
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if user is an artisan and owns this product
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can delete products'
      });
    }

    // Verify product ownership and delete
    const result = await query(`
      DELETE FROM products
      WHERE product_id = $1 AND artisan_id = $2
      RETURNING id
    `, [productId, req.user.user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or access denied'
      });
    }

    // Update artisan's total_products count
    await query(`
      UPDATE artisans
      SET total_products = GREATEST(total_products - 1, 0), updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [req.user.user_id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

// Get artisan's products (authenticated artisan only)
router.get('/artisan/:artisanId', authenticateToken, async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    // Check if user is accessing their own products
    if (req.user.user_id !== artisanId || !req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view these products'
      });
    }

    let sql = `
      SELECT
        id, product_id, title, description, category, craft_tradition,
        price, currency, images, stock_quantity, status, stats,
        created_at, updated_at
      FROM products
      WHERE artisan_id = $1
    `;

    const params = [artisanId];
    if (status) {
      sql += ' AND status = $2';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';
    sql += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);

    const products = result.rows.map(product => ({
      id: product.id,
      productId: product.product_id,
      title: product.title,
      description: product.description,
      category: product.category,
      craftTradition: product.craft_tradition,
      price: product.price,
      currency: product.currency,
      images: product.images,
      stockQuantity: product.stock_quantity,
      status: product.status,
      stats: product.stats,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    res.json({
      success: true,
      data: products,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: result.rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get artisan products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

module.exports = router;
