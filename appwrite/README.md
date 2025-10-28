# CultureCart Appwrite Database Architecture

Complete backend setup for CultureCart - an AI-powered artisan marketplace.

## 🚀 Quick Setup

1. **Install Appwrite CLI:**
   ```bash
   npm install -g appwrite
   ```

2. **Login to Appwrite:**
   ```bash
   appwrite login
   ```

3. **Run setup scripts:**
   ```bash
   # Create project and database
   ./appwrite-setup.sh

   # Create collections
   ./collections/artisans.sh
   ./collections/products.sh
   ./collections/orders.sh
   ./collections/users.sh
   ./collections/reviews.sh
   ./collections/analytics.sh

   # Create storage buckets
   ./storage/buckets.sh

   # Deploy functions
   cd functions
   ./deploy-functions.sh
   ```

## 📊 Database Schema

### Collections Overview

| Collection | Purpose | Records | Key Features |
|------------|---------|---------|--------------|
| `artisans` | Artisan profiles | ~10K | AI bios, verification, ratings |
| `products` | AI-generated listings | ~100K | 3D models, enhanced images |
| `orders` | Purchase tracking | ~50K | Multi-item, payment integration |
| `users` | Customer profiles | ~25K | Wishlist, preferences |
| `reviews` | Product feedback | ~75K | Verified reviews, ratings |
| `analytics` | Platform metrics | ~1M+ | Event tracking, AI performance |

### Storage Buckets

| Bucket | Purpose | Max Size | Access |
|--------|---------|----------|--------|
| `artisan-profiles` | Profile images | 5MB | Public read |
| `product-images` | Product photos | 10MB | Public read |
| `product-3d-models` | 3D models | 50MB | Public read |
| `voice-recordings` | Artisan audio | 25MB | Private |

## 🔧 Functions

### AI Product Processor
- **Trigger:** Product creation
- **Purpose:** Auto-enhance images, generate AI content
- **Runtime:** Node.js 18
- **Timeout:** 300s

### Order Notification
- **Trigger:** Order status updates
- **Purpose:** Send SMS/email notifications
- **Runtime:** Node.js 18
- **Timeout:** 60s

### Analytics Aggregator
- **Trigger:** Daily at 1 AM
- **Purpose:** Aggregate metrics, update dashboards
- **Runtime:** Node.js 18
- **Timeout:** 900s

## 🔐 Security Configuration

### Authentication
- Email/Password enabled
- Google OAuth for buyers
- Phone SMS for artisans
- Session duration: 30 days

### Permissions Matrix

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| artisans | Any | Users | Artisan/Admin | Admin |
| products | Any* | Artisan | Artisan/Admin | Artisan/Admin |
| orders | Buyer/Artisan/Admin | Users | Admin | Admin |
| users | User/Admin | Users | User/Admin | User/Admin |
| reviews | Any | Users | Admin | Admin |
| analytics | Admin | Any | Admin | Admin |

*Published products only

### Rate Limiting
- Products API: 100 req/min per IP
- AI generation: 10 req/hour per artisan
- File uploads: 20 req/hour per user

## 📈 Performance Optimizations

### Indexes
- **Composite indexes** for complex queries
- **Full-text search** on products and artisans
- **Time-based indexes** for analytics
- **Geospatial indexes** for location search

### Query Examples

```javascript
// Featured products
const featured = await databases.listDocuments('products', [
    Query.equal('status', 'published'),
    Query.equal('featured', true),
    Query.orderDesc('salesCount'),
    Query.limit(16)
]);

// Search artisans
const artisans = await databases.listDocuments('artisans', [
    Query.equal('craftType', 'Madhubani'),
    Query.equal('state', 'Bihar'),
    Query.orderDesc('rating'),
    Query.limit(20)
]);

// User orders
const orders = await databases.listDocuments('orders', [
    Query.equal('buyerId', userId),
    Query.orderDesc('createdAt'),
    Query.limit(50)
]);
```

## 🔄 Data Migration

### Schema Updates
1. Create new collection with updated schema
2. Run migration script to copy data
3. Update application code
4. Switch aliases and remove old collection

### Sample Migration Script
```javascript
// Migrate artisans to new schema
async function migrateArtisans() {
    const artisans = await databases.listDocuments('artisans');
    for (const artisan of artisans.documents) {
        await databases.createDocument('artisans_v2', artisan.$id, {
            ...artisan,
            newField: 'default_value'
        });
    }
}
```

## 📊 Analytics & Monitoring

### Key Metrics
- **User Engagement:** Daily/weekly active users
- **Conversion:** Browse → Add to cart → Purchase
- **Artisan Performance:** Products sold, ratings, response time
- **AI Performance:** Generation success rate, processing time
- **Platform Health:** API response times, error rates

### Monitoring Queries
```javascript
// Daily active users
const dau = await databases.listDocuments('analytics', [
    Query.equal('eventType', 'user_login'),
    Query.greaterThanEqual('timestamp', yesterday),
    Query.limit(1000)
]);

// Conversion funnel
const views = await databases.listDocuments('analytics', [
    Query.equal('eventType', 'product_view'),
    Query.greaterThanEqual('timestamp', lastWeek)
]);
```

## 🚀 Deployment Checklist

- [ ] Project created with correct region
- [ ] All collections created with attributes
- [ ] Indexes created for performance
- [ ] Storage buckets configured
- [ ] Functions deployed and tested
- [ ] Authentication configured
- [ ] Permissions set correctly
- [ ] Rate limiting configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts set up

## 🛠️ Troubleshooting

### Common Issues

1. **Function timeouts:** Increase timeout or optimize code
2. **Rate limiting:** Implement caching or increase limits
3. **Index conflicts:** Check index definitions
4. **Permission errors:** Verify collection permissions

### Debug Commands
```bash
# Check function logs
appwrite functions listExecutions --functionId ai-product-processor

# Test database connection
appwrite databases listCollections --databaseId culturecart_db

# Check storage usage
appwrite storage listBuckets
```

## 📚 Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Database Design Best Practices](https://appwrite.io/docs/databases)
- [Functions Guide](https://appwrite.io/docs/functions)
- [Security Best Practices](https://appwrite.io/docs/security)

---

**CultureCart** - Connecting artisans with the world through AI-powered craftsmanship 🪴
