#!/bin/bash

# Create Storage Buckets for CultureCart
echo "📦 Creating storage buckets..."

# Artisan Profiles Bucket
echo "Creating artisan-profiles bucket..."
appwrite storage createBucket \
    --bucketId artisan-profiles \
    --name "Artisan Profiles" \
    --permissions 'read("any")' 'create("users")' 'update("users")' 'delete("users","role:admin")' \
    --fileSecurity true \
    --maximumFileSize 5242880 \
    --allowedFileExtensions '["jpg","jpeg","png","webp"]' \
    --compression "gzip" \
    --encryption true \
    --antivirus true

# Product Images Bucket
echo "Creating product-images bucket..."
appwrite storage createBucket \
    --bucketId product-images \
    --name "Product Images" \
    --permissions 'read("any")' 'create("role:artisan")' 'update("role:artisan")' 'delete("role:artisan","role:admin")' \
    --fileSecurity true \
    --maximumFileSize 10485760 \
    --allowedFileExtensions '["jpg","jpeg","png","webp"]' \
    --compression "gzip" \
    --encryption true \
    --antivirus true

# Product 3D Models Bucket
echo "Creating product-3d-models bucket..."
appwrite storage createBucket \
    --bucketId product-3d-models \
    --name "Product 3D Models" \
    --permissions 'read("any")' 'create("role:artisan")' 'update("role:artisan")' 'delete("role:artisan","role:admin")' \
    --fileSecurity true \
    --maximumFileSize 52428800 \
    --allowedFileExtensions '["gltf","glb"]' \
    --compression "none" \
    --encryption true \
    --antivirus true

# Voice Recordings Bucket
echo "Creating voice-recordings bucket..."
appwrite storage createBucket \
    --bucketId voice-recordings \
    --name "Voice Recordings" \
    --permissions 'read("role:artisan")' 'create("role:artisan")' 'update("role:artisan")' 'delete("role:artisan","role:admin")' \
    --fileSecurity true \
    --maximumFileSize 26214400 \
    --allowedFileExtensions '["mp3","wav","webm"]' \
    --compression "none" \
    --encryption true \
    --antivirus true

echo "✅ Storage buckets setup complete!"
