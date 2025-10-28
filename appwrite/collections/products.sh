#!/bin/bash

# Create Products Collection
echo "🛍️ Creating products collection..."

appwrite databases createCollection \
    --databaseId culturecart_db \
    --collectionId products \
    --name "Products" \
    --permissions 'read("any")' 'create("role:artisan")' 'update("role:artisan")' 'delete("role:artisan","role:admin")' \
    --documentSecurity true

# String Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key productId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key artisanId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key title \
    --size 200 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key story \
    --size 5000 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key description \
    --size 2000 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key seoDescription \
    --size 180 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key model3dUrl \
    --size 500 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key currency \
    --size 3 \
    --required false \
    --default "INR"

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key dimensions \
    --size 100 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key careInstructions \
    --size 1000 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key craftTradition \
    --size 100 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key aiMetadata \
    --size 5000 \
    --required false \
    --default "{}"

# Array Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key originalImages \
    --size 500 \
    --required true \
    --array true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key enhancedImages \
    --size 500 \
    --required true \
    --array true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key lifestyleMockups \
    --size 500 \
    --required false \
    --array true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key tags \
    --size 50 \
    --required true \
    --array true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key materials \
    --size 100 \
    --required false \
    --array true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key techniques \
    --size 100 \
    --required false \
    --array true

# Enum Attributes
appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key category \
    --elements "WallArt,Sculpture,Textile,Jewelry,HomeDecor,Pottery,Furniture,Accessory,Painting,Clothing" \
    --required true

appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key status \
    --elements "draft,pending,published,rejected,soldOut,archived" \
    --required true \
    --default "draft"

# Float Attributes
appwrite databases createFloatAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key price \
    --required true

appwrite databases createFloatAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key discountPrice \
    --required false

appwrite databases createFloatAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key weight \
    --required false

# Integer Attributes
appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key stockQuantity \
    --required false \
    --default 1

appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key views \
    --required false \
    --default 0

appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key likes \
    --required false \
    --default 0

appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key salesCount \
    --required false \
    --default 0

# Boolean Attributes
appwrite databases createBooleanAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key customizable \
    --required false \
    --default false

appwrite databases createBooleanAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key featured \
    --required false \
    --default false

# Datetime Attributes
appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key createdAt \
    --required true

appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key updatedAt \
    --required true

appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId products \
    --key publishedAt \
    --required false

# Create Indexes
echo "🔍 Creating indexes for products collection..."

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key productId \
    --type unique \
    --attributes '["productId"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key artisan_status \
    --type key \
    --attributes '["artisanId","status"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key category_status \
    --type key \
    --attributes '["category","status"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key craft_status \
    --type key \
    --attributes '["craftTradition","status"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key price \
    --type key \
    --attributes '["price"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key featured_published \
    --type key \
    --attributes '["featured","publishedAt"]' \
    --orders '["ASC","DESC"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key stock \
    --type key \
    --attributes '["stockQuantity"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key sales \
    --type key \
    --attributes '["salesCount"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key views \
    --type key \
    --attributes '["views"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key createdAt \
    --type key \
    --attributes '["createdAt"]' \
    --orders '["DESC"]'

# Full-text search index
appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId products \
    --key search \
    --type fulltext \
    --attributes '["title","story","tags"]'

echo "✅ Products collection setup complete!"
