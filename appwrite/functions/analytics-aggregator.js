const sdk = require('node-appwrite');

// Initialize Appwrite SDK
const client = new sdk.Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

module.exports = async (req, res) => {
    try {
        console.log('🚀 Starting daily analytics aggregation...');

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
        const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();

        // Aggregate product analytics
        await aggregateProductMetrics(yesterdayStart, yesterdayEnd);

        // Aggregate user analytics
        await aggregateUserMetrics(yesterdayStart, yesterdayEnd);

        // Aggregate artisan analytics
        await aggregateArtisanMetrics(yesterdayStart, yesterdayEnd);

        // Aggregate platform metrics
        await aggregatePlatformMetrics(yesterdayStart, yesterdayEnd);

        console.log('✅ Daily analytics aggregation completed');
        res.json({ success: true, message: 'Analytics aggregated successfully' });

    } catch (error) {
        console.error('❌ Analytics aggregation failed:', error);
        res.json({ success: false, error: error.message });
    }
};

async function aggregateProductMetrics(startDate, endDate) {
    console.log('📊 Aggregating product metrics...');

    // Get all products
    const products = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'products',
        [
            sdk.Query.equal('status', 'published'),
            sdk.Query.limit(1000)
        ]
    );

    for (const product of products.documents) {
        // Count views for yesterday
        const viewEvents = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            'analytics',
            [
                sdk.Query.equal('eventType', 'product_view'),
                sdk.Query.equal('productId', product.productId),
                sdk.Query.greaterThanEqual('timestamp', startDate),
                sdk.Query.lessThanEqual('timestamp', endDate)
            ]
        );

        // Count likes for yesterday
        const likeEvents = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            'analytics',
            [
                sdk.Query.equal('eventType', 'product_like'),
                sdk.Query.equal('productId', product.productId),
                sdk.Query.greaterThanEqual('timestamp', startDate),
                sdk.Query.lessThanEqual('timestamp', endDate)
            ]
        );

        // Count sales for yesterday
        const salesEvents = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            'analytics',
            [
                sdk.Query.equal('eventType', 'purchase'),
                sdk.Query.equal('productId', product.productId),
                sdk.Query.greaterThanEqual('timestamp', startDate),
                sdk.Query.lessThanEqual('timestamp', endDate)
            ]
        );

        // Update product metrics
        const newViews = product.views + viewEvents.total;
        const newLikes = product.likes + likeEvents.total;
        const newSales = product.salesCount + salesEvents.total;

        await databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID,
            'products',
            product.$id,
            {
                views: newViews,
                likes: newLikes,
                salesCount: newSales,
                updatedAt: new Date().toISOString()
            }
        );
    }
}

async function aggregateUserMetrics(startDate, endDate) {
    console.log('👥 Aggregating user metrics...');

    // Get all users
    const users = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'users',
        [sdk.Query.limit(1000)]
    );

    for (const user of users.documents) {
        // Count orders for yesterday
        const orders = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            'orders',
            [
                sdk.Query.equal('buyerId', user.userId),
                sdk.Query.equal('orderStatus', 'delivered'),
                sdk.Query.greaterThanEqual('createdAt', startDate),
                sdk.Query.lessThanEqual('createdAt', endDate)
            ]
        );

        // Calculate total spent yesterday
        const totalSpentYesterday = orders.documents.reduce(
            (total, order) => total + order.totalAmount,
            0
        );

        // Update user metrics
        const newTotalOrders = user.totalOrders + orders.total;
        const newTotalSpent = user.totalSpent + totalSpentYesterday;

        await databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID,
            'users',
            user.$id,
            {
                totalOrders: newTotalOrders,
                totalSpent: newTotalSpent,
                lastActive: new Date().toISOString()
            }
        );
    }
}

async function aggregateArtisanMetrics(startDate, endDate) {
    console.log('🎨 Aggregating artisan metrics...');

    // Get all artisans
    const artisans = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'artisans',
        [sdk.Query.limit(1000)]
    );

    for (const artisan of artisans.documents) {
        // Count products published yesterday
        const newProducts = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            'products',
            [
                sdk.Query.equal('artisanId', artisan.userId),
                sdk.Query.greaterThanEqual('publishedAt', startDate),
                sdk.Query.lessThanEqual('publishedAt', endDate)
            ]
        );

        // Count sales from yesterday
        const sales = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            'orders',
            [
                sdk.Query.equal('orderStatus', 'delivered'),
                sdk.Query.greaterThanEqual('createdAt', startDate),
                sdk.Query.lessThanEqual('createdAt', endDate),
                // Note: In production, you'd need to check order items for artisan products
            ]
        );

        // Calculate average rating from reviews
        const reviews = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            'reviews',
            [
                sdk.Query.equal('artisanId', artisan.userId),
                sdk.Query.equal('status', 'approved')
            ]
        );

        const avgRating = reviews.total > 0
            ? reviews.documents.reduce((sum, review) => sum + review.rating, 0) / reviews.total
            : artisan.rating;

        // Update artisan metrics
        const newTotalProducts = artisan.totalProducts + newProducts.total;
        const newTotalSales = artisan.totalSales + sales.total;

        await databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID,
            'artisans',
            artisan.$id,
            {
                totalProducts: newTotalProducts,
                totalSales: newTotalSales,
                rating: avgRating,
                updatedAt: new Date().toISOString()
            }
        );
    }
}

async function aggregatePlatformMetrics(startDate, endDate) {
    console.log('📈 Aggregating platform metrics...');

    // Count total events yesterday
    const totalEvents = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'analytics',
        [
            sdk.Query.greaterThanEqual('timestamp', startDate),
            sdk.Query.lessThanEqual('timestamp', endDate)
        ]
    );

    // Count new users yesterday
    const newUsers = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'users',
        [
            sdk.Query.greaterThanEqual('createdAt', startDate),
            sdk.Query.lessThanEqual('createdAt', endDate)
        ]
    );

    // Count new artisans yesterday
    const newArtisans = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'artisans',
        [
            sdk.Query.greaterThanEqual('createdAt', startDate),
            sdk.Query.lessThanEqual('createdAt', endDate)
        ]
    );

    // Count orders yesterday
    const orders = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        'orders',
        [
            sdk.Query.greaterThanEqual('createdAt', startDate),
            sdk.Query.lessThanEqual('createdAt', endDate)
        ]
    );

    // Calculate total revenue yesterday
    const totalRevenue = orders.documents.reduce(
        (total, order) => total + order.totalAmount,
        0
    );

    // Log daily summary (you might want to store this in a separate metrics collection)
    console.log(`📊 Daily Summary (${new Date(startDate).toDateString()}):`);
    console.log(`- Total Events: ${totalEvents.total}`);
    console.log(`- New Users: ${newUsers.total}`);
    console.log(`- New Artisans: ${newArtisans.total}`);
    console.log(`- Orders: ${orders.total}`);
    console.log(`- Revenue: ₹${totalRevenue}`);

    // In production, you might store these metrics in a separate collection
    // for historical tracking and dashboard display
}
