-- ==========================================================
-- SMART KRISHI MARKET ADVISOR
-- Agricultural Demand and Supply Management System
-- MySQL 8.0+ Database Schema and Initial Seed Script
-- ==========================================================

CREATE DATABASE IF NOT EXISTS smart_krishi_db;
USE smart_krishi_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'farmer',
    phone VARCHAR(30),
    location VARCHAR(255) DEFAULT 'Hyderabad, Telangana',
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Farmer Profiles
CREATE TABLE IF NOT EXISTS farmers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    farm_size_acres DECIMAL(6,2) DEFAULT 3.5,
    primary_crops TEXT,
    soil_type VARCHAR(100) DEFAULT 'Black Cotton Soil',
    irrigation_type VARCHAR(100) DEFAULT 'Drip / Borewell',
    experience_years INT DEFAULT 8,
    CONSTRAINT fk_farmers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Buyer Profiles
CREATE TABLE IF NOT EXISTS buyers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) DEFAULT 'Wholesale Trader',
    gst_number VARCHAR(50),
    procurement_capacity_tonnes DECIMAL(10,2) DEFAULT 50.0,
    CONSTRAINT fk_buyers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    telugu_name VARCHAR(100) NOT NULL,
    hindi_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    season VARCHAR(50) NOT NULL,
    ideal_soil VARCHAR(150) NOT NULL,
    water_requirement VARCHAR(50) NOT NULL,
    duration_days INT NOT NULL,
    msp_per_quintal INT NOT NULL,
    description TEXT NOT NULL
);

-- 5. Markets Table
CREATE TABLE IF NOT EXISTS markets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    market_type VARCHAR(50) DEFAULT 'APMC Mandi',
    operational_days VARCHAR(100) DEFAULT 'Daily'
);

-- 6. Demand Supply Estimates Table
CREATE TABLE IF NOT EXISTS demand_supply_estimates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crop_id BIGINT NOT NULL,
    market_id BIGINT NOT NULL,
    estimated_demand_tonnes DECIMAL(12,2) NOT NULL,
    expected_supply_tonnes DECIMAL(12,2) NOT NULL,
    average_price_per_quintal INT NOT NULL,
    reporting_date VARCHAR(20) NOT NULL,
    data_source VARCHAR(100) DEFAULT 'Market Intelligence Cell',
    sample_label VARCHAR(100) DEFAULT 'SAMPLE DATA - ACADEMIC DEMO',
    CONSTRAINT fk_dse_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE,
    CONSTRAINT fk_dse_market FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
);

-- 7. Produce Listings Table
CREATE TABLE IF NOT EXISTS produce_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    crop_id BIGINT NOT NULL,
    market_id BIGINT NOT NULL,
    available_quantity_tonnes DECIMAL(10,2) NOT NULL,
    expected_price_per_quintal INT NOT NULL,
    harvest_date VARCHAR(30) NOT NULL,
    location VARCHAR(255) NOT NULL,
    quality_grade VARCHAR(50) DEFAULT 'Grade A',
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pl_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pl_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE,
    CONSTRAINT fk_pl_market FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
);

-- 8. Buyer Requirements Table
CREATE TABLE IF NOT EXISTS buyer_requirements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    crop_id BIGINT NOT NULL,
    market_id BIGINT NOT NULL,
    required_quantity_tonnes DECIMAL(10,2) NOT NULL,
    target_price_per_quintal INT NOT NULL,
    required_by_date VARCHAR(30) NOT NULL,
    delivery_location VARCHAR(255) NOT NULL,
    status VARCHAR(30) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_br_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_br_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE,
    CONSTRAINT fk_br_market FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
);

-- 9. Callback Requests Table
CREATE TABLE IF NOT EXISTS callback_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    farmer_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    preferred_language VARCHAR(20) DEFAULT 'Telugu',
    reason TEXT NOT NULL,
    preferred_time VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data Insertions
INSERT INTO users (name, email, password_hash, role, phone, location)
VALUES
('Ramesh Reddy', 'farmer@smartkrishi.in', '$2a$10$e8.sampleFarmerHashedPassword', 'farmer', '+91 98480 22334', 'Warangal, Telangana'),
('AgriFresh Foods Ltd', 'buyer@smartkrishi.in', '$2a$10$e8.sampleBuyerHashedPassword', 'buyer', '+91 94401 55667', 'Hyderabad, Telangana'),
('Dr. K. Srinivas', 'admin@smartkrishi.in', '$2a$10$e8.sampleAdminHashedPassword', 'admin', '+91 98499 88771', 'Hyderabad, Telangana');
