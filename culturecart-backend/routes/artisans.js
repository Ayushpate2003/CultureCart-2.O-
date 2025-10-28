const express = require('express');
const { query, getClient } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate, artisanSchemas } = require('../middleware/validation');

const router = express.Router();

// Get all artisans (public)
router.get('/', async (req, res) => {
  try {
    const {
      craft_type,
      state,
      district,
      min_rating,
      featured,
      limit = 20,
      offset = 0
    } = req.query;

    let sql = `
      SELECT
        a.user_id,
        a.email,
        a.full_name,
        a.phone,
        a.location,
        a.craft_type,
        a.specializations,
        a.experience,
        a.bio,
        a.ai_bio,
        a.portfolio,
        a.social_links,
        a.verification_status,
        a.rating,
        a.total_products,
        a.total_sales,
        a.total_revenue,
        a.featured,
        a.languages,
        a.stats,
        a.created_at,
        a.updated_at
      FROM artisans a
      WHERE a.verification_status = 'verified'
    `;

    const params = [];
    const conditions = [];

    if (craft_type) {
      conditions.push('a.craft_type = $' + (params.length + 1));
      params.push(craft_type);
    }

    if (state) {
      conditions.push('a.location->>\'state\' = $' + (params.length + 1));
      params.push(state);
    }

    if (district) {
      conditions.push('a.location->>\'district\' = $' + (params.length + 1));
      params.push(district);
    }

    if (min_rating) {
      conditions.push('a.rating >= $' + (params.length + 1));
      params.push(parseFloat(min_rating));
    }

    if (featured === 'true') {
      conditions.push('a.featured = true');
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY a.rating DESC, a.total_sales DESC';
    sql += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);

    // Transform the data to match frontend expectations
    const artisans = result.rows.map(artisan => ({
      userId: artisan.user_id,
      email: artisan.email,
      fullName: artisan.full_name,
      phone: artisan.phone,
      location: artisan.location,
      craftType: artisan.craft_type,
      specializations: artisan.specializations,
      experience: artisan.experience,
      bio: artisan.bio,
      aiBio: artisan.ai_bio,
      portfolio: artisan.portfolio,
      socialLinks: artisan.social_links,
      verificationStatus: artisan.verification_status,
      rating: artisan.rating,
      totalProducts: artisan.total_products,
      totalSales: artisan.total_sales,
      totalRevenue: artisan.total_revenue,
      featured: artisan.featured,
      languages: artisan.languages,
      stats: artisan.stats,
      createdAt: artisan.created_at,
      updatedAt: artisan.updated_at
    }));

    res.json({
      success: true,
      data: artisans,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: result.rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get artisans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artisans'
    });
  }
});

// Get artisan by ID (public)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(`
      SELECT
        a.user_id,
        a.email,
        a.full_name,
        a.phone,
        a.location,
        a.craft_type,
        a.specializations,
        a.experience,
        a.bio,
        a.ai_bio,
        a.portfolio,
        a.social_links,
        a.verification_status,
        a.rating,
        a.total_products,
        a.total_sales,
        a.total_revenue,
        a.featured,
        a.languages,
        a.stats,
        a.created_at,
        a.updated_at
      FROM artisans a
      WHERE a.user_id = $1 AND a.verification_status = 'verified'
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }

    const artisan = result.rows[0];

    // Transform data
    const transformedArtisan = {
      userId: artisan.user_id,
      email: artisan.email,
      fullName: artisan.full_name,
      phone: artisan.phone,
      location: artisan.location,
      craftType: artisan.craft_type,
      specializations: artisan.specializations,
      experience: artisan.experience,
      bio: artisan.bio,
      aiBio: artisan.ai_bio,
      portfolio: artisan.portfolio,
      socialLinks: artisan.social_links,
      verificationStatus: artisan.verification_status,
      rating: artisan.rating,
      totalProducts: artisan.total_products,
      totalSales: artisan.total_sales,
      totalRevenue: artisan.total_revenue,
      featured: artisan.featured,
      languages: artisan.languages,
      stats: artisan.stats,
      createdAt: artisan.created_at,
      updatedAt: artisan.updated_at
    };

    res.json({
      success: true,
      data: transformedArtisan
    });
  } catch (error) {
    console.error('Get artisan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artisan'
    });
  }
});

// Update artisan profile (authenticated artisan only)
router.put('/:userId', authenticateToken, validate(artisanSchemas.updateProfile), async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Check if user is updating their own profile and is an artisan
    if (req.user.user_id !== userId || !req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this profile'
      });
    }

    const updateFields = [];
    const params = [];
    let paramCount = 1;

    // Build dynamic update query
    if (updates.fullName !== undefined) {
      updateFields.push(`full_name = $${paramCount++}`);
      params.push(updates.fullName);
    }
    if (updates.phone !== undefined) {
      updateFields.push(`phone = $${paramCount++}`);
      params.push(updates.phone);
    }
    if (updates.location !== undefined) {
      updateFields.push(`location = $${paramCount++}`);
      params.push(JSON.stringify(updates.location));
    }
    if (updates.bio !== undefined) {
      updateFields.push(`bio = $${paramCount++}`);
      params.push(updates.bio);
    }
    if (updates.portfolio !== undefined) {
      updateFields.push(`portfolio = $${paramCount++}`);
      params.push(updates.portfolio);
    }
    if (updates.socialLinks !== undefined) {
      updateFields.push(`social_links = $${paramCount++}`);
      params.push(JSON.stringify(updates.socialLinks));
    }
    if (updates.languages !== undefined) {
      updateFields.push(`languages = $${paramCount++}`);
      params.push(updates.languages);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const sql = `
      UPDATE artisans
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $${paramCount}
      RETURNING *
    `;
    params.push(userId);

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }

    const updatedArtisan = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        userId: updatedArtisan.user_id,
        fullName: updatedArtisan.full_name,
        phone: updatedArtisan.phone,
        location: updatedArtisan.location,
        bio: updatedArtisan.bio,
        portfolio: updatedArtisan.portfolio,
        socialLinks: updatedArtisan.social_links,
        languages: updatedArtisan.languages,
        updatedAt: updatedArtisan.updated_at
      }
    });
  } catch (error) {
    console.error('Update artisan profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Get artisan statistics (authenticated artisan only)
router.get('/:userId/stats', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is accessing their own stats and is an artisan
    if (req.user.user_id !== userId || !req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view these statistics'
      });
    }

    // Get comprehensive stats
    const statsQuery = `
      SELECT
        COUNT(DISTINCT p.id) as total_products,
        COUNT(DISTINCT CASE WHEN p.status = 'published' THEN p.id END) as published_products,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_revenue,
        AVG(r.rating) as average_rating,
        COUNT(DISTINCT r.id) as total_reviews,
        COUNT(DISTINCT CASE WHEN o.order_status = 'completed' THEN o.id END) as completed_orders
      FROM artisans a
      LEFT JOIN products p ON a.user_id = p.artisan_id
      LEFT JOIN orders o ON p.product_id = ANY(o.items::jsonb->>'productIds')
      LEFT JOIN reviews r ON p.product_id = r.product_id
      WHERE a.user_id = $1
    `;

    const statsResult = await query(statsQuery, [userId]);
    const stats = statsResult.rows[0];

    res.json({
      success: true,
      data: {
        totalProducts: parseInt(stats.total_products) || 0,
        publishedProducts: parseInt(stats.published_products) || 0,
        totalOrders: parseInt(stats.total_orders) || 0,
        totalRevenue: parseFloat(stats.total_revenue) || 0,
        averageRating: parseFloat(stats.average_rating) || 0,
        totalReviews: parseInt(stats.total_reviews) || 0,
        completedOrders: parseInt(stats.completed_orders) || 0
      }
    });
  } catch (error) {
    console.error('Get artisan stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
