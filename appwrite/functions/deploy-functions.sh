#!/bin/bash

# Deploy Appwrite Functions for CultureCart
echo "🚀 Deploying CultureCart functions..."

# AI Product Processor Function
echo "Deploying AI Product Processor..."
appwrite functions create \
    --functionId ai-product-processor \
    --name "AI Product Processor" \
    --runtime "node-18" \
    --execute '["event"]' \
    --events '["databases.culturecart_db.collections.products.documents.create"]' \
    --schedule "" \
    --timeout 300 \
    --enabled true \
    --logging true \
    --entrypoint "ai-product-processor.js"

# Deploy function code
appwrite functions createDeployment \
    --functionId ai-product-processor \
    --entrypoint "ai-product-processor.js" \
    --code "./ai-product-processor.js" \
    --activate true

# Add environment variables
appwrite functions createVariable \
    --functionId ai-product-processor \
    --key "GEMINI_API_KEY" \
    --value "$GEMINI_API_KEY"

appwrite functions createVariable \
    --functionId ai-product-processor \
    --key "CLOUDINARY_URL" \
    --value "$CLOUDINARY_URL"

# Order Notification Function
echo "Deploying Order Notification..."
appwrite functions create \
    --functionId order-notification \
    --name "Order Notification" \
    --runtime "node-18" \
    --execute '["event"]' \
    --events '["databases.culturecart_db.collections.orders.documents.update"]' \
    --schedule "" \
    --timeout 60 \
    --enabled true \
    --logging true \
    --entrypoint "order-notification.js"

# Deploy function code
appwrite functions createDeployment \
    --functionId order-notification \
    --entrypoint "order-notification.js" \
    --code "./order-notification.js" \
    --activate true

# Analytics Aggregator Function
echo "Deploying Analytics Aggregator..."
appwrite functions create \
    --functionId analytics-aggregator \
    --name "Analytics Aggregator" \
    --runtime "node-18" \
    --execute '["schedule"]' \
    --events '[]' \
    --schedule "0 1 * * *" \
    --timeout 900 \
    --enabled true \
    --logging true \
    --entrypoint "analytics-aggregator.js"

# Deploy function code
appwrite functions createDeployment \
    --functionId analytics-aggregator \
    --entrypoint "analytics-aggregator.js" \
    --code "./analytics-aggregator.js" \
    --activate true

echo "✅ All functions deployed successfully!"
