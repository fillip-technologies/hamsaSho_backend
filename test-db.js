const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function testConnection() {
  console.log("=== Testing MySQL Database Connection ===");
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Port: ${process.env.DB_PORT || 3306}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log("Connecting...");

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
      connectTimeout: 5000,
    });

    console.log("✓ SUCCESS: Connected to MySQL Database successfully!");

    const [tables] = await conn.query("SHOW TABLES;");
    console.log("Tables in database:", tables.map((t) => Object.values(t)[0]));

    await conn.end();
  } catch (err) {
    console.error("✗ FAILED to connect to MySQL Database.");
    console.error(`Error Code: ${err.code}`);
    console.error(`Error Message: ${err.message}`);

    if (err.code === "ETIMEDOUT") {
      console.log("\n--- DIAGNOSIS ---");
      console.log("The connection timed out because cPanel's firewall is blocking incoming connections on port 3306.");
      console.log("To fix this:");
      console.log("1. Open your cPanel dashboard.");
      console.log("2. Go to 'Databases' -> 'Remote MySQL'.");
      console.log("3. Add '%' (to allow all IPs) or your IP address.");
      console.log("4. Click 'Add Host'.");
    } else if (err.code === "ECONNREFUSED") {
      console.log("\n--- DIAGNOSIS ---");
      console.log("The host refused connection on port 3306. Check if DB_HOST and DB_PORT are correct.");
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("\n--- DIAGNOSIS ---");
      console.log("Access denied. The username or password in .env is incorrect or not assigned to the database in cPanel.");
    }
  }
}

testConnection();
