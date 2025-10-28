const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate, reviewSchemas } = require('../middleware/validation');

const router = express.Router();

// Get reviews for a product (public)
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await query(`
      SELECT
        r.id,
        r.review_id,
        r.product_id,
        r.buyer_id,
        r.rating,
        r.title,
        r.comment,
        r.images,
        r.helpful,
        r.verified_purchase,
        r.status,
        r.created_at,
        r.updated_at,
        u.email as buyer_email,
        LEFT(u.email, 1) || '***' || RIGHT(u.email, 1) as buyer_display_name
      FROM reviews r
      JOIN users u ON r.buyer_id = u.user_id
      WHERE r.product_id = $1 AND r.status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [productId, parseInt(limit), parseInt(offset)]);

    const reviews = result.rows.map(review => ({
      id: review.id,
      reviewId: review.review_id,
      productId: review.product_id,
      buyerId: review.buyer_id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images,
      helpful: review.helpful,
      verifiedPurchase: review.verified_purchase,
      status: review.status,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      buyer: {
        displayName: review.buyer_display_name,
        verifiedPurchase: review.verified_purchase
      }
    }));

    res.json({
      success: true,
      data: reviews,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: result.rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Create review (authenticated buyer only)
router.post('/', authenticateToken, validate(reviewSchemas.create), async (req, res) => {
  try {
    const { productId, rating, title, comment, images } = req.body;

    // Check if user is a buyer
    if (!req.user.roles.includes('buyer')) {
      return res.status(403).json({
        success: false,
        message: 'Only buyers can create reviews'
      });
    }

    // Check if user has purchased this product
    const purchaseCheck = await query(`
      SELECT DISTINCT o.id
      FROM orders o
      LEFT JOIN LATERAL jsonb_array_elements(o.items) as item ON true
      WHERE o.buyer_id = $1
        AND (item->>'productId')::text = $2
        AND o.order_status IN ('delivered', 'completed')
    `, [req.user.user_id, productId]);

    const verifiedPurchase = purchaseCheck.rows.length > 0;

    // Check if user already reviewed this product
    const existingReview = await query(
      'SELECT id FROM reviews WHERE product_id = $1 AND buyer_id = $2',
      [productId, req.user.user_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Generate review ID
    const reviewId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    const result = await query(`
      INSERT INTO reviews (
        review_id, product_id, buyer_id, rating, title, comment,
        images, verified_purchase, status, helpful
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      reviewId,
      productId,
      req.user.user_id,
      rating,
      title,
      comment,
      JSON.stringify(images || []),
      verifiedPurchase,
      'pending', // Reviews need approval
      0
    ]);

    const newReview = result.rows[0];

    // Update product rating stats
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        reviewId: newReview.review_id,
        rating: newReview.rating,
        status: newReview.status,
        verifiedPurchase: newReview.verified_purchase,
        createdAt: newReview.created_at
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review'
    });
  }
});

// Update review (authenticated buyer only)
router.put('/:reviewId', authenticateToken, validate(reviewSchemas.update), async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updates = req.body;

    // Check if user owns this review
    const ownershipCheck = await query(
      'SELECT product_id FROM reviews WHERE review_id = $1 AND buyer_id = $2',
      [reviewId, req.user.user_id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or access denied'
      });
    }

    const productId = ownershipCheck.rows[0].product_id;

    const updateFields = [];
    const params = [];
    let paramCount = 1;

    // Build dynamic update query
    if (updates.rating !== undefined) {
      updateFields.push(`rating = $${paramCount++}`);
      params.push(updates.rating);
    }
    if (updates.title !== undefined) {
      updateFields.push(`title = $${paramCount++}`);
      params.push(updates.title);
    }
    if (updates.comment !== undefined) {
      updateFields.push(`comment = $${paramCount++}`);
      params.push(updates.comment);
    }
    if (updates.images !== undefined) {
      updateFields.push(`images = $${paramCount++}`);
      params.push(JSON.stringify(updates.images));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const sql = `
      UPDATE reviews
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE review_id = $${paramCount}
      RETURNING *
    `;
    params.push(reviewId);

    const result = await query(sql, params);
    const updatedReview = result.rows[0];

    // Update product rating stats
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: {
        reviewId: updatedReview.review_id,
        rating: updatedReview.rating,
        title: updatedReview.title,
        comment: updatedReview.comment,
        updatedAt: updatedReview.updated_at
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
});

// Delete review (authenticated buyer only)
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Check if user owns this review
    const ownershipCheck = await query(
      'SELECT product_id FROM reviews WHERE review_id = $1 AND buyer_id = $2',
      [reviewId, req.user.user_id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or access denied'
      });
    }

    const productId = ownershipCheck.rows[0].product_id;

    // Delete review
    await query('DELETE FROM reviews WHERE review_id = $1', [reviewId]);

    // Update product rating stats
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// Mark review as helpful (authenticated user)
router.post('/:reviewId/helpful', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Check if review exists
    const reviewCheck = await query(
      'SELECT id FROM reviews WHERE review_id = $1 AND status = $2',
      [reviewId, 'approved']
    );

    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Increment helpful count
    const result = await query(`
      UPDATE reviews
      SET helpful = helpful + 1, updated_at = CURRENT_TIMESTAMP
      WHERE review_id = $1
      RETURNING helpful
    `, [reviewId]);

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: {
        helpful: result.rows[0].helpful
      }
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful'
    });
  }
});

// Get user's reviews (authenticated user)
router.get('/user/reviews', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await query(`
      SELECT
        r.id,
        r.review_id,
        r.product_id,
        r.rating,
        r.title,
        r.comment,
        r.images,
        r.helpful,
        r.verified_purchase,
        r.status,
        r.created_at,
        r.updated_at,
        p.title as product_title,
        p.images as product_images
      FROM reviews r
      JOIN products p ON r.product_id = p.product_id
      WHERE r.buyer_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.user.user_id, parseInt(limit), parseInt(offset)]);

    const reviews = result.rows.map(review => ({
      id: review.id,
      reviewId: review.review_id,
      productId: review.product_id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images,
      helpful: review.helpful,
      verifiedPurchase: review.verified_purchase,
      status: review.status,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      product: {
        title: review.product_title,
        images: review.product_images
      }
    }));

    res.json({
      success: true,
      data: reviews,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: result.rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Admin: Approve/Reject review (authenticated admin only)
router.put('/:reviewId/status', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can moderate reviews'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved or rejected'
      });
    }

    const result = await query(`
      UPDATE reviews
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE review_id = $2
      RETURNING review_id, status, product_id
    `, [status, reviewId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const updatedReview = result.rows[0];

    // Update product rating stats if approved
    if (status === 'approved') {
      await updateProductRating(updatedReview.product_id);
    }

    res.json({
      success: true,
      message: `Review ${status} successfully`,
      data: {
        reviewId: updatedReview.review_id,
        status: updatedReview.status
      }
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status'
    });
  }
});

// Helper function to update product rating stats
async function updateProductRating(productId) {
  try {
    // Calculate new average rating and review count
    const statsResult = await query(`
      SELECT
        AVG(rating) as average_rating,
        COUNT(*) as review_count
      FROM reviews
      WHERE product_id = $1 AND status = 'approved'
    `, [productId]);

    const { average_rating, review_count } = statsResult.rows[0];

    // Update product stats
    await query(`
      UPDATE products
      SET stats = jsonb_set(
        jsonb_set(
          COALESCE(stats, '{}'),
          '{averageRating}',
          $1::text::jsonb
        ),
        '{reviewCount}',
        $2::text::jsonb
      ),
      updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $3
    `, [
      Math.round((parseFloat(average_rating) || 0) * 10) / 10,
      parseInt(review_count) || 0,
      productId
    ]);
  } catch (error) {
    console.error('Update product rating error:', error);
  }
}

module.exports = router;
