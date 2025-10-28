#!/bin/bash

# CultureCart Appwrite Setup Script
# This script creates the complete database architecture for CultureCart

echo "🚀 Setting up CultureCart Appwrite Database..."

# Check if Appwrite CLI is installed
if ! command -v appwrite &> /dev/null; then
    echo "❌ Appwrite CLI not found. Install with: npm install -g appwrite"
    exit 1
fi

# Login to Appwrite (you'll need to provide your credentials)
echo "🔐 Please login to Appwrite CLI:"
appwrite login

# Create Project
echo "📁 Creating CultureCart project..."
appwrite projects create \
    --projectId culturecart-prod \
    --name "CultureCart" \
    --teamId "your-team-id" \
    --region "mumbai"

# Set project context
appwrite client setProject --projectId culturecart-prod

# Create Database
echo "🗄️ Creating CultureCart database..."
appwrite databases create \
    --databaseId culturecart_db \
    --name "CultureCart Database"

echo "✅ Database setup complete!"
echo "📋 Next steps:"
echo "1. Run individual collection setup scripts"
echo "2. Configure storage buckets"
echo "3. Deploy functions"
echo "4. Set up authentication"
