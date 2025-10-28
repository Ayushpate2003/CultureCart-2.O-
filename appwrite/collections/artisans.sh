#!/bin/bash

# Create Artisans Collection
echo "🎨 Creating artisans collection..."

appwrite databases createCollection \
    --databaseId culturecart_db \
    --collectionId artisans \
    --name "Artisans" \
    --permissions 'read("any")' 'create("users")' 'update("users")' 'delete("role:admin")' \
    --documentSecurity true

# String Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key userId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key name \
    --size 100 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key village \
    --size 100 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key state \
    --size 50 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key district \
    --size 100 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key phoneNumber \
    --size 15 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key profileImage \
    --size 500 \
    --required false \
    --default "default-avatar.png"

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key bio \
    --size 1000 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key aiBio \
    --size 2000 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key bankDetails \
    --size 500 \
    --required false

# Enum Attributes
appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key craftType \
    --elements "Patachitra,Madhubani,Warli,Kalamkari,Gond,Chikankari,BlockPrinting,Pottery,Woodcraft,MetalCraft,Jewelry,Textile,Bamboo,Other" \
    --required true

appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key language \
    --elements "Hindi,Bengali,Tamil,Telugu,Marathi,Gujarati,Kannada,Malayalam,Odia,Punjabi,English" \
    --required true \
    --default "Hindi"

appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key verificationStatus \
    --elements "pending,verified,rejected,suspended" \
    --required true \
    --default "pending"

appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key onboardedBy \
    --elements "web,mobile,admin,partnership" \
    --required false \
    --default "web"

# Integer Attributes
appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key yearsOfExperience \
    --required false \
    --default 0

appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key totalProducts \
    --required false \
    --default 0

appwrite databases createIntegerAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key totalSales \
    --required false \
    --default 0

# Float Attributes
appwrite databases createFloatAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key rating \
    --required false \
    --default 0

# Boolean Attributes
appwrite databases createBooleanAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key featured \
    --required false \
    --default false

# Array Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key verificationDocuments \
    --size 500 \
    --required false \
    --array true

# Datetime Attributes
appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key createdAt \
    --required true

appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key updatedAt \
    --required true

# Create Indexes
echo "🔍 Creating indexes for artisans collection..."

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key userId \
    --type unique \
    --attributes '["userId"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key state_craft \
    --type key \
    --attributes '["state","craftType"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key verification_featured \
    --type key \
    --attributes '["verificationStatus","featured"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key phoneNumber \
    --type unique \
    --attributes '["phoneNumber"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key createdAt \
    --type key \
    --attributes '["createdAt"]' \
    --orders '["DESC"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId artisans \
    --key rating \
    --type key \
    --attributes '["rating"]'

echo "✅ Artisans collection setup complete!"
