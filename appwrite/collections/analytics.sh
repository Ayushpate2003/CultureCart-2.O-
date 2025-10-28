#!/bin/bash

# Create Analytics Collection
echo "📊 Creating analytics collection..."

appwrite databases createCollection \
    --databaseId culturecart_db \
    --collectionId analytics \
    --name "Analytics" \
    --permissions 'read("role:admin")' 'create("any")' 'update("role:admin")' 'delete("role:admin")' \
    --documentSecurity true

# String Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key eventId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key userId \
    --size 36 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key productId \
    --size 36 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key metadata \
    --size 5000 \
    --required false \
    --default "{}"

# Enum Attributes
appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key eventType \
    --elements "product_view,product_like,add_to_cart,purchase,ai_generation_success,ai_generation_failure,voice_upload,search,user_registration,artisan_onboarding" \
    --required true

# Datetime Attributes
appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key timestamp \
    --required true

# Create Indexes
echo "🔍 Creating indexes for analytics collection..."

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key eventId \
    --type unique \
    --attributes '["eventId"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key event_timestamp \
    --type key \
    --attributes '["eventType","timestamp"]' \
    --orders '["ASC","DESC"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key product_timestamp \
    --type key \
    --attributes '["productId","timestamp"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key user_timestamp \
    --type key \
    --attributes '["userId","timestamp"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId analytics \
    --key eventType \
    --type key \
    --attributes '["eventType"]'

echo "✅ Analytics collection setup complete!"
