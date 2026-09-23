const mysql = require("mysql2/promise");

let pool = null;
let isConnected = false;
let lastError = "Database not checked yet";
let lastChecked = null;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "srv1276.hstgr.io",
      user: process.env.DB_USER || "u516064072_hamsaadmin",
      password: process.env.DB_PASSWORD || "#qU8m9FZ2m",
      database: process.env.DB_NAME || "u516064072_hamsaadmin",
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000,
    });
  }
  return pool;
};

const checkDbConnection = async (force = false) => {
  const now = Date.now();
  // Cache check for 10 seconds unless forced
  if (!force && lastChecked && now - lastChecked < 10000) {
    return { ok: isConnected, error: lastError };
  }

  lastChecked = now;
  try {
    const currentPool = getPool();
    // Fast 3.5s timeout promise race
    const conn = await Promise.race([
      currentPool.getConnection(),
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "ETIMEDOUT: Connection to Hostinger MySQL timed out (Port 3306 may be firewalled)"
              )
            ),
          3500
        )
      ),
    ]);

    conn.release();
    isConnected = true;
    lastError = null;
    return { ok: true, error: null };
  } catch (err) {
    isConnected = false;
    lastError = err.message || err.code;
    return { ok: false, error: lastError };
  }
};

const initDB = async () => {
  console.log("Checking connection to Hostinger MySQL Database...");
  console.log(`Target Host: ${process.env.DB_HOST || "srv1276.hstgr.io"}:${process.env.DB_PORT || 3306}`);
  console.log(`Database: ${process.env.DB_NAME || "u516064072_hamsaadmin"} (User: ${process.env.DB_USER || "u516064072_hamsaadmin"})`);

  const status = await checkDbConnection(true);

  if (!status.ok) {
    console.warn("------------------------------------------------------------------");
    console.warn("⚠️  NOTICE: Could not connect to Hostinger MySQL directly.");
    console.warn(`Reason: ${status.error}`);
    console.warn("Explanation:");
    console.warn("Hostinger blocks remote MySQL connections by default.");
    console.warn("To connect from your computer:");
    console.warn("1. Open Hostinger hPanel -> Databases -> Remote MySQL.");
    console.warn("2. Add '%' or your public IP address to the allowed hosts list.");
    console.warn("⚡ FALLBACK ACTIVE: Zero-Loss Local Buffer is actively recording all");
    console.warn("inquiries and serving the Admin Dashboard seamlessly!");
    console.warn("------------------------------------------------------------------");
    return false;
  }

  try {
    const currentPool = getPool();
    const connection = await currentPool.getConnection();
    console.log("✓ Connected to Hostinger MySQL Database successfully.");

    // Create admins table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create contacts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        organization VARCHAR(200) NOT NULL,
        designation VARCHAR(120) NOT NULL,
        email VARCHAR(150) NOT NULL,
        mobile VARCHAR(50) NOT NULL,
        city VARCHAR(100) DEFAULT '',
        hospital_type VARCHAR(100) NOT NULL,
        beds VARCHAR(50) DEFAULT '',
        product VARCHAR(100) DEFAULT 'e_Kshitiz',
        current_his VARCHAR(150) DEFAULT '',
        message TEXT,
        status ENUM('New', 'Contacted', 'In Progress', 'Closed') DEFAULT 'New',
        admin_notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create testimonials table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        position VARCHAR(150) DEFAULT NULL,
        hospital VARCHAR(200) NOT NULL,
        quote TEXT NOT NULL,
        logo_url VARCHAR(500) DEFAULT NULL,
        backdrop_color VARCHAR(50) DEFAULT '#FF4D27',
        backdrop_rotate VARCHAR(20) DEFAULT 'rotate-6',
        avatar_bg VARCHAR(100) DEFAULT 'bg-white',
        is_active TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure default admin exists
    const [existingAdmin] = await connection.query(
      "SELECT id FROM admins WHERE email = 'admin@hamsasoham.com' LIMIT 1"
    );
    if (existingAdmin.length === 0) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("AdminPassword123", 10);
      await connection.query(
        "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Hamsa Soham Admin", "admin@hamsasoham.com", hashedPassword, "admin"]
      );
      console.log("Default admin account created: admin@hamsasoham.com");
    }

    connection.release();
    console.log("MySQL Tables verified and ready.");
    return true;
  } catch (err) {
    console.error("Error during MySQL table initialization:", err.message);
    return false;
  }
};

const getDbStatus = () => {
  return {
    connected: isConnected,
  };
};

module.exports = {
  getPool,
  initDB,
  checkDbConnection,
  getDbStatus,
  isConnected: () => isConnected,
};
