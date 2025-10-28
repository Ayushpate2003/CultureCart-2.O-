-- CultureCart Database Schema
-- PostgreSQL initialization script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('buyer', 'artisan', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived', 'out_of_stock');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    roles user_role[] DEFAULT ARRAY['buyer'::user_role],
    metadata JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Artisans table
CREATE TABLE artisans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location JSONB NOT NULL,
    craft_type VARCHAR(100) NOT NULL,
    specializations TEXT[],
    experience INTEGER DEFAULT 0,
    bio TEXT,
    ai_bio TEXT,
    portfolio TEXT[],
    social_links JSONB DEFAULT '{}',
    verification_status verification_status DEFAULT 'pending',
    verification_documents TEXT[],
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_products INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.0,
    featured BOOLEAN DEFAULT FALSE,
    languages TEXT[] DEFAULT ARRAY['en'],
    preferences JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(255) UNIQUE NOT NULL,
    artisan_id VARCHAR(255) NOT NULL REFERENCES artisans(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ai_description TEXT,
    category VARCHAR(100) NOT NULL,
    craft_tradition VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    images TEXT[],
    ai_images TEXT[],
    video_url VARCHAR(500),
    model_3d_url VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    min_order_quantity INTEGER DEFAULT 1,
    dimensions JSONB,
    weight JSONB,
    materials TEXT[],
    colors TEXT[],
    tags TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    eco_friendly BOOLEAN DEFAULT FALSE,
    handmade BOOLEAN DEFAULT TRUE,
    customizable BOOLEAN DEFAULT FALSE,
    status product_status DEFAULT 'draft',
    seo JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(255) UNIQUE NOT NULL,
    order_number VARCHAR(255) UNIQUE NOT NULL,
    buyer_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0.0,
    shipping DECIMAL(10,2) DEFAULT 0.0,
    discount DECIMAL(10,2) DEFAULT 0.0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    order_status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    notes TEXT,
    tracking_number VARCHAR(255),
    estimated_delivery DATE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id VARCHAR(255) UNIQUE NOT NULL,
    product_id VARCHAR(255) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    order_id VARCHAR(255) REFERENCES orders(order_id) ON DELETE SET NULL,
    buyer_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    artisan_id VARCHAR(255) NOT NULL REFERENCES artisans(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    helpful INTEGER DEFAULT 0,
    status review_status DEFAULT 'pending',
    response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE SET NULL,
    product_id VARCHAR(255) REFERENCES products(product_id) ON DELETE SET NULL,
    artisan_id VARCHAR(255) REFERENCES artisans(user_id) ON DELETE SET NULL,
    order_id VARCHAR(255) REFERENCES orders(order_id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_artisans_user_id ON artisans(user_id);
CREATE INDEX idx_artisans_craft_type ON artisans(craft_type);
CREATE INDEX idx_artisans_location ON artisans USING GIN(location);
CREATE INDEX idx_artisans_rating ON artisans(rating DESC);
CREATE INDEX idx_products_artisan_id ON products(artisan_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_buyer_id ON reviews(buyer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX idx_analytics_session_id ON analytics(session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON artisans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove in production)
-- This will be populated by migration scripts from Appwrite
