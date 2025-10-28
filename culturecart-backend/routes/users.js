const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validate, userSchemas } = require('../middleware/validation');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, user_id, email, roles, metadata, preferences, stats, email_verified, created_at, updated_at FROM users WHERE user_id = $1',
      [req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user: result.rows[0] }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, validate(userSchemas.updateProfile), async (req, res) => {
  try {
    const updates = req.body;
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (typeof updates[key] === 'object') {
          updateFields.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(updates[key]));
        } else {
          updateFields.push(`${key} = $${paramCount}`);
          values.push(updates[key]);
        }
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(req.user.user_id);

    const result = await query(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $${paramCount}
       RETURNING id, user_id, email, roles, metadata, preferences, stats, email_verified, created_at, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: result.rows[0] }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Complete onboarding
router.post('/onboarding/complete', authenticateToken, async (req, res) => {
  try {
    const { location, language } = req.body;

    if (!location || !language) {
      return res.status(400).json({
        success: false,
        message: 'Location and language are required'
      });
    }

    const result = await query(
      `UPDATE users
       SET metadata = jsonb_set(
         jsonb_set(metadata, '{onboardingCompleted}', 'true'),
         '{location}', $1::jsonb
       ),
       preferences = jsonb_set(preferences, '{language}', $2::jsonb),
       updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3
       RETURNING id, user_id, email, roles, metadata, preferences`,
      [JSON.stringify(location), JSON.stringify(language), req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: { user: result.rows[0] }
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete onboarding'
    });
  }
});

// Get user stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get order stats
    const orderStats = await query(
      `SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_spent,
        COUNT(CASE WHEN order_status = 'delivered' THEN 1 END) as completed_orders
       FROM orders WHERE buyer_id = $1`,
      [req.user.user_id]
    );

    // Get wishlist count (if you have a wishlist feature)
    const wishlistStats = await query(
      'SELECT COUNT(*) as wishlist_count FROM user_wishlists WHERE user_id = $1',
      [req.user.user_id]
    );

    const stats = {
      totalOrders: parseInt(orderStats.rows[0].total_orders),
      totalSpent: parseFloat(orderStats.rows[0].total_spent),
      completedOrders: parseInt(orderStats.rows[0].completed_orders),
      wishlistCount: parseInt(wishlistStats.rows[0].wishlist_count)
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user stats'
    });
  }
});

// Admin: Get all users
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const values = [];
    let paramCount = 1;

    if (search) {
      whereClause += ` AND (email ILIKE $${paramCount} OR metadata->>'fullName' ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    if (role) {
      whereClause += ` AND $${paramCount} = ANY(roles)`;
      values.push(role);
      paramCount++;
    }

    values.push(limit, offset);

    const result = await query(
      `SELECT id, user_id, email, roles, metadata, preferences, stats, email_verified, created_at, updated_at
       FROM users
       WHERE 1=1 ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM users WHERE 1=1 ${whereClause}`,
      values.slice(0, -2) // Remove limit and offset
    );

    res.json({
      success: true,
      data: {
        users: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          pages: Math.ceil(countResult.rows[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// Admin: Update user role
router.put('/:userId/role', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { roles } = req.body;

    if (!Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        message: 'Roles must be an array'
      });
    }

    const result = await query(
      'UPDATE users SET roles = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING id, user_id, email, roles',
      [roles, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user: result.rows[0] }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
});

module.exports = router;
