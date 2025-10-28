#!/bin/bash

# Create Orders Collection
echo "📦 Creating orders collection..."

appwrite databases createCollection \
    --databaseId culturecart_db \
    --collectionId orders \
    --name "Orders" \
    --permissions 'read("users")' 'create("users")' 'update("role:admin")' 'delete("role:admin")' \
    --documentSecurity true

# String Attributes
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key orderId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key orderNumber \
    --size 20 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key buyerId \
    --size 36 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key buyerName \
    --size 100 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key buyerEmail \
    --size 255 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key buyerPhone \
    --size 15 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key currency \
    --size 3 \
    --required false \
    --default "INR"

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key paymentId \
    --size 255 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key trackingNumber \
    --size 100 \
    --required false

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key notes \
    --size 500 \
    --required false

# JSON Attributes (stored as strings)
appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key items \
    --size 10000 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key shippingAddress \
    --size 1000 \
    --required true

appwrite databases createStringAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key billingAddress \
    --size 1000 \
    --required false

# Enum Attributes
appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key paymentMethod \
    --elements "razorpay,stripe,cod,upi" \
    --required true

appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key paymentStatus \
    --elements "pending,processing,completed,failed,refunded" \
    --required true \
    --default "pending"

appwrite databases createEnumAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key orderStatus \
    --elements "pending,confirmed,processing,shipped,delivered,cancelled,returned" \
    --required true \
    --default "pending"

# Float Attributes
appwrite databases createFloatAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key subtotal \
    --required true

appwrite databases createFloatAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key shippingCost \
    --required true

appwrite databases createFloatAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key tax \
    --required true

appwrite databases createFloatAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key totalAmount \
    --required true

# Datetime Attributes
appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key estimatedDelivery \
    --required false

appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key deliveredAt \
    --required false

appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key createdAt \
    --required true

appwrite databases createDatetimeAttribute \
    --databaseId culturecart_db \
    --collectionId orders \
    --key updatedAt \
    --required true

# Create Indexes
echo "🔍 Creating indexes for orders collection..."

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId orders \
    --key orderId \
    --type unique \
    --attributes '["orderId"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId orders \
    --key orderNumber \
    --type unique \
    --attributes '["orderNumber"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId orders \
    --key buyer_created \
    --type key \
    --attributes '["buyerId","createdAt"]' \
    --orders '["ASC","DESC"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId orders \
    --key order_status \
    --type key \
    --attributes '["orderStatus","createdAt"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId orders \
    --key payment_status \
    --type key \
    --attributes '["paymentStatus"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId orders \
    --key total_amount \
    --type key \
    --attributes '["totalAmount"]'

appwrite databases createIndex \
    --databaseId culturecart_db \
    --collectionId orders \
    --key payment_id \
    --type key \
    --attributes '["paymentId"]'

echo "✅ Orders collection setup complete!"
