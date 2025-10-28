#!/bin/bash

# Create Users Collection (Buyers)
echo "👥 Creating users collection..."

appwrite databases createCollection \
    --databaseId culturecart_db \
    --collectionId users \
    --name "Users" \
    --permissions 'read("users")' 'create("users")' 'update("users")' 'delete("users","role:admin")' \
    --documentSecurity true

# String Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key userId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key name \
    --size 100 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key email \
    --size 255 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key phoneNumber \
    --size 15 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key profileImage \
    --size 500 \
    --required false \
    --default "default.png"

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key preferences \
    --size 2000 \
    --required false \
    --default "{}"

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key cart \
    --size 5000 \
    --required false \
    --default "{}"

# Array Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key wishlist \
    --size 36 \
    --required false \
    --array true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key favoriteArtisans \
    --size 36 \
    --required false \
    --array true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key addresses \
    --size 1000 \
    --required false \
    --array true

# Integer Attributes
appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key totalOrders \
    --required false \
    --default 0

# Float Attributes
appwrite databases createFloatAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key totalSpent \
    --required false \
    --default 0

# Boolean Attributes
appwrite databases createBooleanAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key newsletter \
    --required false \
    --default false

# Datetime Attributes
appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key createdAt \
    --required true

appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId users \
    --key lastActive \
    --required true

# Create Indexes
echo "🔍 Creating indexes for users collection..."

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId users \
    --key userId \
    --type unique \
    --attributes '["userId"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId users \
    --key email \
    --type unique \
    --attributes '["email"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId users \
    --key total_orders \
    --type key \
    --attributes '["totalOrders"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId users \
    --key createdAt \
    --type key \
    --attributes '["createdAt"]' \
    --orders '["DESC"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId users \
    --key lastActive \
    --type key \
    --attributes '["lastActive"]' \
    --orders '["DESC"]'

echo "✅ Users collection setup complete!"
