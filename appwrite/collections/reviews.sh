#!/bin/bash

# Create Reviews Collection
echo "⭐ Creating reviews collection..."

appwrite databases createCollection \
    --databaseId culturecart_db \
    --collectionId reviews \
    --name "Reviews" \
    --permissions 'read("any")' 'create("users")' 'update("role:admin")' 'delete("role:admin")' \
    --documentSecurity true

# String Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key reviewId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key productId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key artisanId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key userId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key orderId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key title \
    --size 100 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key comment \
    --size 1000 \
    --required false

# Array Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key images \
    --size 500 \
    --required false \
    --array true

# Integer Attributes
appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key rating \
    --required true \
    --min 1 \
    --max 5 \
    --default 5

appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key helpful \
    --required false \
    --default 0

# Boolean Attributes
appwrite databases createBooleanAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key verified \
    --required false \
    --default false

# Enum Attributes
appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key status \
    --elements "pending,approved,rejected,flagged" \
    --required true \
    --default "pending"

# Datetime Attributes
appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key createdAt \
    --required true

# Create Indexes
echo "🔍 Creating indexes for reviews collection..."

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key reviewId \
    --type unique \
    --attributes '["reviewId"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key product_status \
    --type key \
    --attributes '["productId","status"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key artisan_rating \
    --type key \
    --attributes '["artisanId","rating"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key verified_created \
    --type key \
    --attributes '["verified","createdAt"]' \
    --orders '["ASC","DESC"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId reviews \
    --key status \
    --type key \
    --attributes '["status"]'

echo "✅ Reviews collection setup complete!"
