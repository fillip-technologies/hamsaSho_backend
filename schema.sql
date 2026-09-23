-- Hamsa Soham Enterprise Database Schema for cPanel MySQL / MariaDB
-- You can import this file via cPanel phpMyAdmin or run it in the MySQL CLI

CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `organization` VARCHAR(200) NOT NULL,
  `designation` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(50) NOT NULL,
  `city` VARCHAR(100) DEFAULT '',
  `hospital_type` VARCHAR(100) NOT NULL,
  `beds` VARCHAR(50) DEFAULT '',
  `product` VARCHAR(100) DEFAULT 'e_Kshitiz',
  `current_his` VARCHAR(150) DEFAULT '',
  `message` TEXT,
  `status` ENUM('New', 'Contacted', 'In Progress', 'Closed') DEFAULT 'New',
  `admin_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `position` VARCHAR(150) DEFAULT NULL,
  `hospital` VARCHAR(200) NOT NULL,
  `quote` TEXT NOT NULL,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `backdrop_color` VARCHAR(50) DEFAULT '#FF4D27',
  `backdrop_rotate` VARCHAR(20) DEFAULT 'rotate-6',
  `avatar_bg` VARCHAR(100) DEFAULT 'bg-white',
  `is_active` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial default admin user
-- Email: admin@hamsasoham.com
-- Password: AdminPassword123
INSERT IGNORE INTO `admins` (`name`, `email`, `password`, `role`)
VALUES ('Super Administrator', 'admin@hamsasoham.com', '$2b$10$T2x1FiV689l5VPb8Biz3xuU8MM06fAvMJ7BTPE90gtSEBmfNpMO52', 'admin');
