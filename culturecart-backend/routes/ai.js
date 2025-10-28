const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate, aiSchemas } = require('../middleware/validation');

const router = express.Router();

// Get AI suggestions for product description (authenticated artisan only)
router.post('/product-description', authenticateToken, validate(aiSchemas.generateDescription), async (req, res) => {
  try {
    // Check if user is an artisan
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can generate AI descriptions'
      });
    }

    const { productTitle, category, craftTradition, materials, targetAudience } = req.body;

    // This is a placeholder for AI integration
    // In a real implementation, you would call an AI service like OpenAI, Claude, etc.
    const aiDescription = generateMockAIDescription(productTitle, category, craftTradition, materials, targetAudience);

    res.json({
      success: true,
      data: {
        description: aiDescription,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI product description error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI description'
    });
  }
});

// Get AI suggestions for product pricing (authenticated artisan only)
router.post('/product-pricing', authenticateToken, validate(aiSchemas.generatePricing), async (req, res) => {
  try {
    // Check if user is an artisan
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can generate AI pricing'
      });
    }

    const { category, materials, craftsmanshipHours, marketLocation } = req.body;

    // Get market data for pricing suggestions
    const marketData = await query(`
      SELECT
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        COUNT(*) as sample_size
      FROM products
      WHERE category = $1 AND status = 'published'
    `, [category]);

    const pricing = generateMockAIPricing(
      category,
      materials,
      craftsmanshipHours,
      marketLocation,
      marketData.rows[0]
    );

    res.json({
      success: true,
      data: {
        suggestedPrice: pricing.suggestedPrice,
        priceRange: pricing.priceRange,
        reasoning: pricing.reasoning,
        marketData: {
          averagePrice: parseFloat(marketData.rows[0]?.avg_price || 0),
          minPrice: parseFloat(marketData.rows[0]?.min_price || 0),
          maxPrice: parseFloat(marketData.rows[0]?.max_price || 0),
          sampleSize: parseInt(marketData.rows[0]?.sample_size || 0)
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI product pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI pricing'
    });
  }
});

// Get AI suggestions for artisan bio (authenticated artisan only)
router.post('/artisan-bio', authenticateToken, validate(aiSchemas.generateBio), async (req, res) => {
  try {
    // Check if user is an artisan
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can generate AI bio'
      });
    }

    const { craftType, experience, specializations, location, achievements } = req.body;

    const aiBio = generateMockAIArtisanBio(craftType, experience, specializations, location, achievements);

    res.json({
      success: true,
      data: {
        bio: aiBio,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI artisan bio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI bio'
    });
  }
});

// Get AI product categorization suggestions (authenticated artisan only)
router.post('/product-categorization', authenticateToken, validate(aiSchemas.categorizeProduct), async (req, res) => {
  try {
    // Check if user is an artisan
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can get AI categorization'
      });
    }

    const { productTitle, description, materials } = req.body;

    const categorization = generateMockAICategorization(productTitle, description, materials);

    res.json({
      success: true,
      data: {
        category: categorization.category,
        craftTradition: categorization.craftTradition,
        tags: categorization.tags,
        confidence: categorization.confidence,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI product categorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to categorize product'
    });
  }
});

// Get AI market insights (authenticated user)
router.get('/market-insights', authenticateToken, async (req, res) => {
  try {
    const { category, location } = req.query;

    let sql = `
      SELECT
        category,
        COUNT(*) as product_count,
        AVG(price) as avg_price,
        AVG(stats->>'averageRating') as avg_rating,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_products
      FROM products
      WHERE status = 'published'
    `;

    const params = [];
    if (category) {
      sql += ' AND category = $1';
      params.push(category);
    }

    sql += ' GROUP BY category ORDER BY product_count DESC LIMIT 10';

    const marketData = await query(sql, params);

    const insights = marketData.rows.map(row => ({
      category: row.category,
      productCount: parseInt(row.product_count),
      averagePrice: Math.round(parseFloat(row.avg_price) * 100) / 100,
      averageRating: Math.round(parseFloat(row.avg_rating) * 10) / 10,
      recentProducts: parseInt(row.recent_products),
      trend: generateMockTrend(row.recent_products, row.product_count)
    }));

    res.json({
      success: true,
      data: {
        insights,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI market insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get market insights'
    });
  }
});

// Get AI recommendations for buyers (authenticated buyer only)
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    // Check if user is a buyer
    if (!req.user.roles.includes('buyer')) {
      return res.status(403).json({
        success: false,
        message: 'Only buyers can get AI recommendations'
      });
    }

    const { limit = 10 } = req.query;

    // Get user's purchase history
    const purchaseHistory = await query(`
      SELECT DISTINCT
        p.category,
        p.craft_tradition,
        COUNT(*) as purchase_count
      FROM orders o
      LEFT JOIN LATERAL jsonb_array_elements(o.items) as item ON true
      JOIN products p ON (item->>'productId')::text = p.product_id
      WHERE o.buyer_id = $1 AND o.order_status = 'completed'
      GROUP BY p.category, p.craft_tradition
      ORDER BY purchase_count DESC
      LIMIT 5
    `, [req.user.user_id]);

    // Generate recommendations based on purchase history
    let recommendations = [];
    if (purchaseHistory.rows.length > 0) {
      const favoriteCategories = purchaseHistory.rows.map(row => row.category);

      const recommendedProducts = await query(`
        SELECT
          p.product_id,
          p.title,
          p.description,
          p.price,
          p.images,
          p.category,
          p.craft_tradition,
          a.full_name as artisan_name,
          a.rating as artisan_rating,
          p.stats->>'averageRating' as product_rating
        FROM products p
        JOIN artisans a ON p.artisan_id = a.user_id
        WHERE p.category = ANY($1)
          AND p.status = 'published'
          AND a.verification_status = 'verified'
          AND p.product_id NOT IN (
            SELECT DISTINCT (item->>'productId')::text
            FROM orders o
            LEFT JOIN LATERAL jsonb_array_elements(o.items) as item ON true
            WHERE o.buyer_id = $2
          )
        ORDER BY p.stats->>'averageRating' DESC, p.created_at DESC
        LIMIT $3
      `, [favoriteCategories, req.user.user_id, parseInt(limit)]);

      recommendations = recommendedProducts.rows.map(row => ({
        productId: row.product_id,
        title: row.title,
        description: row.description,
        price: parseFloat(row.price),
        images: row.images,
        category: row.category,
        craftTradition: row.craft_tradition,
        artisanName: row.artisan_name,
        artisanRating: parseFloat(row.artisan_rating) || 0,
        productRating: parseFloat(row.product_rating) || 0,
        reason: `Based on your interest in ${row.category} products`
      }));
    } else {
      // New user - show featured products
      const featuredProducts = await query(`
        SELECT
          p.product_id,
          p.title,
          p.description,
          p.price,
          p.images,
          p.category,
          p.craft_tradition,
          a.full_name as artisan_name,
          a.rating as artisan_rating,
          p.stats->>'averageRating' as product_rating
        FROM products p
        JOIN artisans a ON p.artisan_id = a.user_id
        WHERE p.featured = true
          AND p.status = 'published'
          AND a.verification_status = 'verified'
        ORDER BY p.stats->>'averageRating' DESC, p.created_at DESC
        LIMIT $1
      `, [parseInt(limit)]);

      recommendations = featuredProducts.rows.map(row => ({
        productId: row.product_id,
        title: row.title,
        description: row.description,
        price: parseFloat(row.price),
        images: row.images,
        category: row.category,
        craftTradition: row.craft_tradition,
        artisanName: row.artisan_name,
        artisanRating: parseFloat(row.artisan_rating) || 0,
        productRating: parseFloat(row.product_rating) || 0,
        reason: 'Featured product you might like'
      }));
    }

    res.json({
      success: true,
      data: {
        recommendations,
        basedOnHistory: purchaseHistory.rows.length > 0,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
});

// Mock AI functions (replace with actual AI service calls)
function generateMockAIDescription(title, category, craftTradition, materials, targetAudience) {
  return `Discover this exquisite ${title}, a masterpiece of ${craftTradition} craftsmanship from the ${category} collection. Handcrafted using premium ${materials || 'traditional materials'}, this piece embodies the rich heritage and artistic excellence that defines authentic Indian artistry. Perfect for ${targetAudience || 'those who appreciate fine craftsmanship'}, it brings a touch of cultural elegance to any space.`;
}

function generateMockAIPricing(category, materials, hours, location, marketData) {
  const basePrice = marketData.avg_price || 1000;
  const materialMultiplier = materials?.includes('gold') || materials?.includes('silver') ? 2 : 1;
  const hourMultiplier = Math.max(1, hours / 10);
  const locationMultiplier = location?.toLowerCase().includes('metro') ? 1.2 : 1;

  const suggestedPrice = Math.round(basePrice * materialMultiplier * hourMultiplier * locationMultiplier);

  return {
    suggestedPrice,
    priceRange: {
      min: Math.round(suggestedPrice * 0.8),
      max: Math.round(suggestedPrice * 1.3)
    },
    reasoning: `Price calculated based on ${hours} hours of craftsmanship, ${materials || 'materials'} used, market rates in ${location || 'your area'}, and current ${category} market trends.`
  };
}

function generateMockAIArtisanBio(craftType, experience, specializations, location, achievements) {
  return `With over ${experience} years of dedicated craftsmanship in ${craftType}, I bring traditional techniques passed down through generations to create contemporary pieces that tell stories of India's rich cultural heritage. Specializing in ${specializations || 'various traditional crafts'}, my work reflects the authentic essence of ${location} artistry. ${achievements ? 'Recognized for ' + achievements + ', ' : ''}I am committed to preserving and evolving the timeless beauty of Indian handicrafts for modern appreciation.`;
}

function generateMockAICategorization(title, description, materials) {
  // Simple rule-based categorization (replace with ML model)
  const text = (title + ' ' + description + ' ' + materials).toLowerCase();

  let category = 'Home Decor';
  let craftTradition = 'Mixed Media';

  if (text.includes('jewelry') || text.includes('necklace') || text.includes('earring')) {
    category = 'Jewelry';
    craftTradition = 'Jewelry Making';
  } else if (text.includes('textile') || text.includes('fabric') || text.includes('sari')) {
    category = 'Textiles';
    craftTradition = 'Weaving';
  } else if (text.includes('pottery') || text.includes('ceramic') || text.includes('clay')) {
    category = 'Pottery';
    craftTradition = 'Pottery';
  } else if (text.includes('wood') || text.includes('furniture')) {
    category = 'Furniture';
    craftTradition = 'Woodworking';
  }

  const tags = [];
  if (text.includes('handmade')) tags.push('handmade');
  if (text.includes('traditional')) tags.push('traditional');
  if (text.includes('eco')) tags.push('eco-friendly');

  return {
    category,
    craftTradition,
    tags,
    confidence: 0.85
  };
}

function generateMockTrend(recentCount, totalCount) {
  const ratio = recentCount / Math.max(totalCount, 1);
  if (ratio > 0.3) return 'trending_up';
  if (ratio > 0.1) return 'stable';
  return 'trending_down';
}

module.exports = router;
