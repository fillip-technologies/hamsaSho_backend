const bcrypt = require("bcryptjs");
const { getPool, checkDbConnection, getDbStatus } = require("../config/db");

// ---------------------------------------------------------------------------
// CONTACTS SERVICE — MySQL only
// ---------------------------------------------------------------------------

exports.saveContact = async (data) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) {
    throw new Error("Database is currently unavailable. Please try again shortly.");
  }

  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO contacts
      (name, organization, designation, email, mobile, city, hospital_type, beds, product, current_his, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      (data.name || "").trim(),
      (data.organization || "Not specified").trim(),
      (data.designation || "Not specified").trim(),
      (data.email || "").toLowerCase().trim(),
      (data.mobile || "").trim(),
      data.city ? data.city.trim() : "",
      (data.hospitalType || data.hospital_type || "Other").trim(),
      data.beds ? data.beds.trim() : "",
      data.product || "e_Kshitiz",
      (data.currentHis || data.current_his || "").trim(),
      data.message ? data.message.trim() : "",
      "New",
    ]
  );

  const [rows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [result.insertId]);
  const row = rows[0];

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    organization: row.organization,
    designation: row.designation,
    email: row.email,
    mobile: row.mobile,
    city: row.city,
    hospitalType: row.hospital_type,
    hospital_type: row.hospital_type,
    beds: row.beds,
    product: row.product,
    currentHis: row.current_his,
    current_his: row.current_his,
    message: row.message,
    status: row.status,
    adminNotes: row.admin_notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

exports.getContacts = async ({ status, product, search } = {}) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) {
    throw new Error("Database is currently unavailable.");
  }

  const pool = getPool();
  let sql = "SELECT * FROM contacts WHERE 1=1";
  const params = [];

  if (status && status !== "All") {
    sql += " AND status = ?";
    params.push(status);
  }

  if (product && product !== "All") {
    sql += " AND product = ?";
    params.push(product);
  }

  if (search && search.trim()) {
    const s = `%${search.trim()}%`;
    sql += " AND (name LIKE ? OR organization LIKE ? OR email LIKE ? OR mobile LIKE ? OR city LIKE ? OR designation LIKE ?)";
    params.push(s, s, s, s, s, s);
  }

  sql += " ORDER BY created_at DESC";

  const [rows] = await pool.query(sql, params);

  return rows.map((row) => ({
    _id: row.id,
    id: row.id,
    name: row.name,
    organization: row.organization,
    designation: row.designation,
    email: row.email,
    mobile: row.mobile,
    city: row.city,
    hospitalType: row.hospital_type,
    hospital_type: row.hospital_type,
    beds: row.beds,
    product: row.product,
    currentHis: row.current_his,
    current_his: row.current_his,
    message: row.message,
    status: row.status,
    adminNotes: row.admin_notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

exports.getStats = async () => {
  const contacts = await exports.getContacts({});
  return {
    total: contacts.length,
    new: contacts.filter((c) => c.status === "New").length,
    contacted: contacts.filter((c) => c.status === "Contacted").length,
    inProgress: contacts.filter((c) => c.status === "In Progress").length,
    closed: contacts.filter((c) => c.status === "Closed").length,
  };
};

exports.updateContact = async (id, { status, adminNotes }) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) {
    throw new Error("Database is currently unavailable.");
  }

  const pool = getPool();
  const updates = [];
  const params = [];

  if (status) {
    updates.push("status = ?");
    params.push(status);
  }
  if (adminNotes !== undefined) {
    updates.push("admin_notes = ?");
    params.push(adminNotes);
  }

  if (updates.length === 0) return null;

  params.push(id);
  await pool.query(`UPDATE contacts SET ${updates.join(", ")} WHERE id = ?`, params);

  const [rows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [id]);
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    organization: row.organization,
    designation: row.designation,
    email: row.email,
    mobile: row.mobile,
    city: row.city,
    hospitalType: row.hospital_type,
    beds: row.beds,
    product: row.product,
    currentHis: row.current_his,
    message: row.message,
    status: row.status,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

exports.deleteContact = async (id) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) {
    throw new Error("Database is currently unavailable.");
  }

  const pool = getPool();
  await pool.query("DELETE FROM contacts WHERE id = ?", [id]);
  return true;
};

// ---------------------------------------------------------------------------
// ADMIN AUTHENTICATION SERVICE — MySQL only
// ---------------------------------------------------------------------------

exports.findAdminByEmail = async (email) => {
  const normEmail = (email || "").toLowerCase().trim();

  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) {
    throw new Error("Database is currently unavailable.");
  }

  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM admins WHERE email = ? LIMIT 1", [normEmail]);
  return rows.length > 0 ? rows[0] : null;
};

exports.findAdminById = async (id) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) {
    throw new Error("Database is currently unavailable.");
  }

  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM admins WHERE id = ? LIMIT 1",
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

exports.createAdmin = async ({ name, email, password }) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) {
    throw new Error("Database is currently unavailable.");
  }

  const normEmail = email.toLowerCase().trim();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const pool = getPool();
  const [res] = await pool.query(
    "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name.trim(), normEmail, hashedPassword, "admin"]
  );

  return { id: res.insertId, name: name.trim(), email: normEmail, role: "admin" };
};

exports.getDbStatus = getDbStatus;

// ---------------------------------------------------------------------------
// TESTIMONIALS SERVICE
// ---------------------------------------------------------------------------

const mapTestimonialRow = (row) => ({
  id: row.id,
  name: row.name,
  position: row.position || null,
  hospital: row.hospital,
  quote: row.quote,
  logoUrl: row.logo_url || null,
  backdropColor: row.backdrop_color || "#FF4D27",
  backdropRotate: row.backdrop_rotate || "rotate-6",
  avatarBg: row.avatar_bg || "bg-white",
  isActive: !!row.is_active,
  sortOrder: row.sort_order || 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

exports.getTestimonials = async ({ activeOnly = false } = {}) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) throw new Error("Database is currently unavailable.");
  const pool = getPool();
  let sql = "SELECT * FROM testimonials";
  if (activeOnly) sql += " WHERE is_active = 1";
  sql += " ORDER BY sort_order ASC, id ASC";
  const [rows] = await pool.query(sql);
  return rows.map(mapTestimonialRow);
};

exports.createTestimonial = async (data) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) throw new Error("Database is currently unavailable.");
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO testimonials (name, position, hospital, quote, logo_url, backdrop_color, backdrop_rotate, avatar_bg, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      (data.name || "").trim(),
      data.position ? data.position.trim() : null,
      (data.hospital || "").trim(),
      (data.quote || "").trim(),
      data.logoUrl ? data.logoUrl.trim() : null,
      data.backdropColor || "#FF4D27",
      data.backdropRotate || "rotate-6",
      data.avatarBg || "bg-white",
      data.isActive !== false ? 1 : 0,
      data.sortOrder || 0,
    ]
  );
  const [rows] = await pool.query("SELECT * FROM testimonials WHERE id = ?", [result.insertId]);
  return mapTestimonialRow(rows[0]);
};

exports.updateTestimonial = async (id, data) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) throw new Error("Database is currently unavailable.");
  const pool = getPool();
  await pool.query(
    `UPDATE testimonials SET name=?, position=?, hospital=?, quote=?, logo_url=?, backdrop_color=?, backdrop_rotate=?, avatar_bg=?, is_active=?, sort_order=?, updated_at=NOW()
     WHERE id = ?`,
    [
      (data.name || "").trim(),
      data.position ? data.position.trim() : null,
      (data.hospital || "").trim(),
      (data.quote || "").trim(),
      data.logoUrl ? data.logoUrl.trim() : null,
      data.backdropColor || "#FF4D27",
      data.backdropRotate || "rotate-6",
      data.avatarBg || "bg-white",
      data.isActive !== false ? 1 : 0,
      data.sortOrder || 0,
      id,
    ]
  );
  const [rows] = await pool.query("SELECT * FROM testimonials WHERE id = ?", [id]);
  if (rows.length === 0) return null;
  return mapTestimonialRow(rows[0]);
};

exports.deleteTestimonial = async (id) => {
  const dbCheck = await checkDbConnection();
  if (!dbCheck.ok) throw new Error("Database is currently unavailable.");
  const pool = getPool();
  await pool.query("DELETE FROM testimonials WHERE id = ?", [id]);
  return true;
};
