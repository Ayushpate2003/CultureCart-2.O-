/**
 * CultureCart Appwrite Database - Sample Queries
 * Common database operations and queries for the CultureCart application
 */

const sdk = require('node-appwrite');

// Initialize Appwrite SDK
const client = new sdk.Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

// ==========================================
// ARTISAN QUERIES
// ==========================================

/**
 * Get featured artisans for homepage
 */
async function getFeaturedArtisans() {
    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'artisans',
        [
            sdk.Query.equal('verificationStatus', 'verified'),
            sdk.Query.equal('featured', true),
            sdk.Query.orderDesc('rating'),
            sdk.Query.limit(12)
        ]
    );
}

/**
 * Search artisans by craft type and location
 */
async function searchArtisans(craftType, state, district) {
    const queries = [
        sdk.Query.equal('verificationStatus', 'verified'),
        sdk.Query.equal('craftType', craftType),
        sdk.Query.orderDesc('rating'),
        sdk.Query.limit(20)
    ];

    if (state) queries.push(sdk.Query.equal('state', state));
    if (district) queries.push(sdk.Query.equal('district', district));

    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'artisans',
        queries
    );
}

/**
 * Get artisan profile with products count
 */
async function getArtisanProfile(artisanId) {
    const artisan = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        'artisans',
        artisanId
    );

    // Get product count
    const products = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'products',
        [
            sdk.Query.equal('artisanId', artisanId),
            sdk.Query.equal('status', 'published'),
            sdk.Query.limit(1)
        ]
    );

    return {
        ...artisan,
        productCount: products.total
    };
}

// ==========================================
// PRODUCT QUERIES
// ==========================================

/**
 * Get featured products for homepage
 */
async function getFeaturedProducts() {
    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'products',
        [
            sdk.Query.equal('status', 'published'),
            sdk.Query.equal('featured', true),
            sdk.Query.orderDesc('publishedAt'),
            sdk.Query.limit(16)
        ]
    );
}

/**
 * Search products with full-text search
 */
async function searchProducts(query, category, minPrice, maxPrice) {
    const queries = [
        sdk.Query.equal('status', 'published'),
        sdk.Query.search('title', query),
        sdk.Query.limit(50)
    ];

    if (category) queries.push(sdk.Query.equal('category', category));
    if (minPrice) queries.push(sdk.Query.greaterThanEqual('price', minPrice));
    if (maxPrice) queries.push(sdk.Query.lessThanEqual('price', maxPrice));

    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'products',
        queries
    );
}

/**
 * Get products by artisan
 */
async function getArtisanProducts(artisanId, status = 'published') {
    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'products',
        [
            sdk.Query.equal('artisanId', artisanId),
            sdk.Query.equal('status', status),
            sdk.Query.orderDesc('createdAt'),
            sdk.Query.limit(100)
        ]
    );
}

/**
 * Get similar products (same category and craft)
 */
async function getSimilarProducts(productId, category, craftTradition, limit = 8) {
    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'products',
        [
            sdk.Query.notEqual('$id', productId),
            sdk.Query.equal('status', 'published'),
            sdk.Query.equal('category', category),
            sdk.Query.equal('craftTradition', craftTradition),
            sdk.Query.orderDesc('salesCount'),
            sdk.Query.limit(limit)
        ]
    );
}

// ==========================================
// ORDER QUERIES
// ==========================================

/**
 * Get user orders
 */
async function getUserOrders(userId, status = null) {
    const queries = [
        sdk.Query.equal('buyerId', userId),
        sdk.Query.orderDesc('createdAt'),
        sdk.Query.limit(50)
    ];

    if (status) queries.push(sdk.Query.equal('orderStatus', status));

    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'orders',
        queries
    );
}

/**
 * Get artisan orders (products they sold)
 */
async function getArtisanOrders(artisanId) {
    // Note: In production, you'd need to join with order items
    // This is a simplified version
    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'orders',
        [
            sdk.Query.equal('orderStatus', ['confirmed', 'processing', 'shipped', 'delivered']),
            sdk.Query.orderDesc('createdAt'),
            sdk.Query.limit(100)
        ]
    );
}

/**
 * Get order details with items
 */
async function getOrderDetails(orderId) {
    const order = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        'orders',
        orderId
    );

    // Parse items JSON
    order.items = JSON.parse(order.items);
    order.shippingAddress = JSON.parse(order.shippingAddress);
    if (order.billingAddress) {
        order.billingAddress = JSON.parse(order.billingAddress);
    }

    return order;
}

// ==========================================
// REVIEW QUERIES
// ==========================================

/**
 * Get product reviews
 */
async function getProductReviews(productId) {
    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'reviews',
        [
            sdk.Query.equal('productId', productId),
            sdk.Query.equal('status', 'approved'),
            sdk.Query.orderDesc('createdAt'),
            sdk.Query.limit(50)
        ]
    );
}

/**
 * Get artisan reviews
 */
async function getArtisanReviews(artisanId) {
    return await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'reviews',
        [
            sdk.Query.equal('artisanId', artisanId),
            sdk.Query.equal('status', 'approved'),
            sdk.Query.orderDesc('createdAt'),
            sdk.Query.limit(50)
        ]
    );
}

/**
 * Calculate product rating
 */
async function getProductRating(productId) {
    const reviews = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'reviews',
        [
            sdk.Query.equal('productId', productId),
            sdk.Query.equal('status', 'approved')
        ]
    );

    if (reviews.total === 0) return { rating: 0, count: 0 };

    const totalRating = reviews.documents.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.total;

    return {
        rating: Math.round(averageRating * 10) / 10,
        count: reviews.total
    };
}

// ==========================================
// ANALYTICS QUERIES
// ==========================================

/**
 * Get user analytics
 */
async function getUserAnalytics(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'analytics',
        [
            sdk.Query.equal('userId', userId),
            sdk.Query.greaterThanEqual('timestamp', startDate.toISOString()),
            sdk.Query.orderDesc('timestamp'),
            sdk.Query.limit(1000)
        ]
    );

    return events.documents;
}

/**
 * Get product performance
 */
async function getProductAnalytics(productId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'analytics',
        [
            sdk.Query.equal('productId', productId),
            sdk.Query.greaterThanEqual('timestamp', startDate.toISOString()),
            sdk.Query.orderDesc('timestamp'),
            sdk.Query.limit(1000)
        ]
    );

    return events.documents;
}

/**
 * Get platform analytics summary
 */
async function getPlatformAnalytics(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'analytics',
        [
            sdk.Query.greaterThanEqual('timestamp', startDate.toISOString()),
            sdk.Query.limit(5000)
        ]
    );

    // Group by event type
    const analytics = {};
    events.documents.forEach(event => {
        if (!analytics[event.eventType]) {
            analytics[event.eventType] = 0;
        }
        analytics[event.eventType]++;
    });

    return analytics;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Create new order
 */
async function createOrder(orderData) {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        'orders',
        orderId,
        {
            orderId,
            orderNumber: `CC-${Date.now()}`,
            ...orderData,
            items: JSON.stringify(orderData.items),
            shippingAddress: JSON.stringify(orderData.shippingAddress),
            billingAddress: JSON.stringify(orderData.billingAddress || orderData.shippingAddress),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    );
}

/**
 * Update product stock
 */
async function updateProductStock(productId, newStock) {
    return await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        'products',
        productId,
        {
            stockQuantity: newStock,
            updatedAt: new Date().toISOString()
        }
    );
}

/**
 * Log analytics event
 */
async function logAnalyticsEvent(eventType, userId = null, productId = null, metadata = {}) {
    return await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        'analytics',
        `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        {
            eventId: `event_${Date.now()}`,
            eventType,
            userId,
            productId,
            metadata: JSON.stringify(metadata),
            timestamp: new Date().toISOString()
        }
    );
}

module.exports = {
    // Artisan queries
    getFeaturedArtisans,
    searchArtisans,
    getArtisanProfile,

    // Product queries
    getFeaturedProducts,
    searchProducts,
    getArtisanProducts,
    getSimilarProducts,

    // Order queries
    getUserOrders,
    getArtisanOrders,
    getOrderDetails,

    // Review queries
    getProductReviews,
    getArtisanReviews,
    getProductRating,

    // Analytics queries
    getUserAnalytics,
    getProductAnalytics,
    getPlatformAnalytics,

    // Utility functions
    createOrder,
    updateProductStock,
    logAnalyticsEvent
};
