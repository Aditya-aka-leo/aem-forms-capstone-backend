-- Create database (run this first if the database doesn't exist)
CREATE DATABASE IF NOT EXISTS aem_forms_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE aem_forms_db;

-- Drop the old users table if it exists
DROP TABLE IF EXISTS users;

-- Create updated users table matching the User model
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_ref_number VARCHAR(100) NOT NULL UNIQUE,
    mobile_number VARCHAR(10) NOT NULL,
    partner_name VARCHAR(100) NOT NULL,
    identifier_name ENUM('PAN', 'DOB', 'CC4DIGIT', 'DC4DIGIT') NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    preferred_lang VARCHAR(10) NOT NULL DEFAULT 'ENG',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_transaction_ref (transaction_ref_number),
    INDEX idx_mobile_number (mobile_number),
    INDEX idx_partner_name (partner_name),
    INDEX idx_product_name (product_name),
    INDEX idx_date_time (date_time)
);
