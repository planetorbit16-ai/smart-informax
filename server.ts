import express from 'express';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to file-based fallback database
const FALLBACK_DB_PATH = path.join(process.cwd(), 'server_db.json');

const initialData = {
  users: [
    {
      id: 1,
      nama: "Siswa PKL TKJ",
      nis: "22045678",
      sekolah: "SMK Negeri 1 Tanjungpinang",
      jurusan: "Teknik Komputer dan Jaringan (TKJ)",
      kelas: "XII TKJ 1",
      email: "planetorbit16@gmail.com",
      password: "password123",
      role: "user",
      pembimbing: "",
      tempat_pkl: "",
      pembimbing_industri: "",
      tanggal_mulai: "",
      tanggal_selesai: ""
    },
    {
      id: 2,
      nama: "Admin Guru Pembimbing",
      nis: "19780512",
      sekolah: "SMK Negeri 1 Tanjungpinang",
      jurusan: "Teknik Komputer dan Jaringan (TKJ)",
      kelas: "Staff Guru",
      email: "admin@smartinformax.com",
      password: "admin123",
      role: "admin",
      pembimbing: "N/A",
      tempat_pkl: "N/A",
      pembimbing_industri: "N/A",
      tanggal_mulai: "N/A",
      tanggal_selesai: "N/A"
    }
  ],
  jurnals: [],
  videos: [], // empty default as requested to delete dummy videos
  kompetensi: []
};

let memoryDb = initialData;

// Initialize fallback JSON file database if not exists
function initFallbackDb() {
  if (process.env.VERCEL) {
    console.log('⚡ SMART INFORMAX: Menggunakan database in-memory fallback di lingkungan Vercel.');
    return;
  }
  try {
    if (!fs.existsSync(FALLBACK_DB_PATH)) {
      fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
    } else {
      const data = fs.readFileSync(FALLBACK_DB_PATH, 'utf8');
      memoryDb = JSON.parse(data);
    }
  } catch (err) {
    console.error('⚠️ Gagal inisialisasi database lokal, beralih ke in-memory:', err);
  }
}

initFallbackDb();

// Helper to read/write fallback JSON DB
function readFallbackDb() {
  if (process.env.VERCEL) {
    return memoryDb;
  }
  try {
    const data = fs.readFileSync(FALLBACK_DB_PATH, 'utf8');
    memoryDb = JSON.parse(data);
    return memoryDb;
  } catch (err) {
    return memoryDb || { users: [], jurnals: [], videos: [], kompetensi: [] };
  }
}

function writeFallbackDb(data: any) {
  memoryDb = data;
  if (process.env.VERCEL) {
    console.log('⚡ SMART INFORMAX: Mengupdate database in-memory (penulisan ke disk dilewati di Vercel).');
    return;
  }
  try {
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('⚠️ Gagal menulis database lokal ke disk:', err);
  }
}

// -------------------------------------------------------------
// MULTI-DATABASE CONNECTION (Supabase PostgreSQL, MySQL, & Fallback)
// -------------------------------------------------------------
let mysqlPool: mysql.Pool | null = null;
let pgPool: pg.Pool | null = null;
let dbMode: 'postgres' | 'mysql' | 'fallback' = 'fallback';
let isDbConnected = false;
let dbErrorMsg = '';

async function connectToPostgres(): Promise<boolean> {
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  const pgHost = process.env.PGHOST;

  if (!connectionString && !pgHost) {
    console.log('⚠️ PostgreSQL/Supabase: URL atau host belum diatur di .env. Melewati PostgreSQL...');
    return false;
  }

  try {
    const config: any = {};
    if (connectionString) {
      config.connectionString = connectionString;
    } else {
      config.host = pgHost;
      config.user = process.env.PGUSER;
      config.password = process.env.PGPASSWORD;
      config.database = process.env.PGDATABASE;
      config.port = parseInt(process.env.PGPORT || '5432', 10);
    }
    // Enable SSL for secure Supabase cloud database connection (standard on Vercel)
    config.ssl = { rejectUnauthorized: false };

    pgPool = new pg.Pool(config);
    pgPool.on('error', (err) => {
      console.error('⚠️ Unexpected error on idle PostgreSQL client:', err);
    });

    // 3-second connection timeout to avoid blocking Vercel serverless startup
    const connectionPromise = pgPool.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Koneksi PostgreSQL timeout (melebihi 3 detik)')), 3000)
    );

    const client = await Promise.race([connectionPromise, timeoutPromise]) as pg.PoolClient;
    console.log('✅ PostgreSQL/Supabase: Berhasil terhubung ke database cloud Supabase!');

    // Auto-create Tables inside Supabase (if they don't exist yet)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        nis VARCHAR(50) NOT NULL,
        sekolah VARCHAR(255) NOT NULL,
        jurusan VARCHAR(255) NOT NULL DEFAULT 'Teknik Komputer dan Jaringan (TKJ)',
        kelas VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        pembimbing VARCHAR(255) DEFAULT '',
        tempat_pkl VARCHAR(255) DEFAULT '',
        pembimbing_industri VARCHAR(255) DEFAULT '',
        tanggal_mulai VARCHAR(100) DEFAULT '',
        tanggal_selesai VARCHAR(100) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS jurnals (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        judul VARCHAR(255) NOT NULL,
        isi TEXT NOT NULL,
        tanggal VARCHAR(100) NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        video_url TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        difficulty VARCHAR(50) NOT NULL DEFAULT 'Sedang',
        duration VARCHAR(50) NOT NULL DEFAULT '10:00',
        description TEXT NOT NULL,
        steps TEXT NOT NULL,
        views VARCHAR(50) DEFAULT '0 views',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS kompetensi (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        key_kompetensi VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Belum Dimulai',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT user_comp UNIQUE (user_id, key_kompetensi)
      );
    `);

    // Seeds default accounts inside Supabase if not exists
    const adminCheck = await client.query("SELECT * FROM users WHERE email = $1", ["admin@smartinformax.com"]);
    if (adminCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO users (nama, nis, sekolah, kelas, email, password, role, pembimbing, tempat_pkl, pembimbing_industri, tanggal_mulai, tanggal_selesai)
        VALUES ('Admin Guru Pembimbing', '19780512', 'SMK Negeri 1 Tanjungpinang', 'Staff Guru', 'admin@smartinformax.com', 'admin123', 'admin', '', '', '', '', '')
      `);
    }

    const userCheck = await client.query("SELECT * FROM users WHERE email = $1", ["planetorbit16@gmail.com"]);
    if (userCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO users (nama, nis, sekolah, kelas, email, password, role, pembimbing, tempat_pkl, pembimbing_industri, tanggal_mulai, tanggal_selesai)
        VALUES ('Siswa PKL TKJ', '22045678', 'SMK Negeri 1 Tanjungpinang', 'XII TKJ 1', 'planetorbit16@gmail.com', 'password123', 'user', '', '', '', '', '')
      `);
    }

    dbMode = 'postgres';
    isDbConnected = true;
    dbErrorMsg = '';
    client.release();
    return true;
  } catch (err: any) {
    dbErrorMsg = err.message || 'Koneksi PostgreSQL/Supabase gagal';
    console.error(`⚠️ PostgreSQL/Supabase: Gagal terhubung: ${dbErrorMsg}`);
    if (pgPool) {
      try {
        await pgPool.end();
      } catch (e) {}
      pgPool = null;
    }
    return false;
  }
}

async function connectToMySQL(): Promise<boolean> {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  if (!host || !database) {
    dbErrorMsg = 'Kredensial MySQL tidak lengkap di file .env';
    console.log('⚠️ MySQL: Info .env belum lengkap. Melewati MySQL...');
    return false;
  }

  try {
    mysqlPool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // 3-second connection timeout to avoid blocking Vercel serverless startup
    const connectionPromise = mysqlPool.getConnection();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Koneksi MySQL timeout (melebihi 3 detik)')), 3000)
    );

    const connection = await Promise.race([connectionPromise, timeoutPromise]) as mysql.PoolConnection;
    console.log(`✅ MySQL: Berhasil terhubung ke database "${database}" di ${host}:${port}`);
    
    // Auto-create users table in MySQL if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`nama\` VARCHAR(255) NOT NULL,
        \`nis\` VARCHAR(50) NOT NULL,
        \`sekolah\` VARCHAR(255) NOT NULL,
        \`jurusan\` VARCHAR(255) NOT NULL DEFAULT 'Teknik Komputer dan Jaringan (TKJ)',
        \`kelas\` VARCHAR(50) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`role\` VARCHAR(50) NOT NULL DEFAULT 'user',
        \`pembimbing\` VARCHAR(255) DEFAULT '',
        \`tempat_pkl\` VARCHAR(255) DEFAULT '',
        \`pembimbing_industri\` VARCHAR(255) DEFAULT '',
        \`tanggal_mulai\` VARCHAR(100) DEFAULT '',
        \`tanggal_selesai\` VARCHAR(100) DEFAULT '',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Auto-create jurnals table in MySQL if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`jurnals\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT NOT NULL,
        \`judul\` VARCHAR(255) NOT NULL,
        \`isi\` TEXT NOT NULL,
        \`tanggal\` VARCHAR(100) NOT NULL,
        \`kategori\` VARCHAR(100) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Auto-create videos table in MySQL if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`videos\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`video_url\` TEXT NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`difficulty\` VARCHAR(50) NOT NULL DEFAULT 'Sedang',
        \`duration\` VARCHAR(50) NOT NULL DEFAULT '10:00',
        \`description\` TEXT NOT NULL,
        \`steps\` TEXT NOT NULL,
        \`views\` VARCHAR(50) DEFAULT '0 views',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Auto-create kompetensi table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`kompetensi\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT NOT NULL,
        \`key_kompetensi\` VARCHAR(255) NOT NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'Belum Dimulai',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        UNIQUE KEY \`user_comp\` (\`user_id\`, \`key_kompetensi\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed default accounts in MySQL if not exists
    const [adminRows]: any = await connection.query("SELECT * FROM `users` WHERE `email` = 'admin@smartinformax.com'");
    if (adminRows.length === 0) {
      await connection.query(`
        INSERT INTO \`users\` (\`nama\`, \`nis\`, \`sekolah\`, \`kelas\`, \`email\`, \`password\`, \`role\`, \`pembimbing\`, \`tempat_pkl\`, \`pembimbing_industri\`, \`tanggal_mulai\`, \`tanggal_selesai\`)
        VALUES ('Admin Guru Pembimbing', '19780512', 'SMK Negeri 1 Tanjungpinang', 'Staff Guru', 'admin@smartinformax.com', 'admin123', 'admin', '', '', '', '', '')
      `);
    }

    const [userRows]: any = await connection.query("SELECT * FROM `users` WHERE `email` = 'planetorbit16@gmail.com'");
    if (userRows.length === 0) {
      await connection.query(`
        INSERT INTO \`users\` (\`nama\`, \`nis\`, \`sekolah\`, \`kelas\`, \`email\`, \`password\`, \`role\`, \`pembimbing\`, \`tempat_pkl\`, \`pembimbing_industri\`, \`tanggal_mulai\`, \`tanggal_selesai\`)
        VALUES ('Siswa PKL TKJ', '22045678', 'SMK Negeri 1 Tanjungpinang', 'XII TKJ 1', 'planetorbit16@gmail.com', 'password123', 'user', '', '', '', '', '')
      `);
    }

    // Tambah kolom baru ke tabel users secara dinamis agar aman dan backward-compatible jika tabel sudah ada sebelumnya
    try {
      await connection.query("ALTER TABLE `users` ADD COLUMN `pembimbing_industri` VARCHAR(255) DEFAULT ''");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE `users` ADD COLUMN `tanggal_mulai` VARCHAR(100) DEFAULT ''");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE `users` ADD COLUMN `tanggal_selesai` VARCHAR(100) DEFAULT ''");
    } catch (e) {}

    try {
      await connection.query("UPDATE `users` SET `pembimbing` = '' WHERE `pembimbing` = 'Pak Ahmad Sanusi, S.Pd, M.T.'");
    } catch (e) {}
    try {
      await connection.query("UPDATE `users` SET `tempat_pkl` = '' WHERE `tempat_pkl` = 'PT Telekomunikasi Indonesia Tbk'");
    } catch (e) {}

    dbMode = 'mysql';
    isDbConnected = true;
    dbErrorMsg = '';
    connection.release();
    return true;
  } catch (err: any) {
    dbErrorMsg = err.message || 'Koneksi MySQL ditolak';
    console.error(`⚠️ MySQL: Gagal terhubung ke MySQL: ${dbErrorMsg}`);
    if (mysqlPool) {
      try {
        await mysqlPool.end();
      } catch (e) {}
      mysqlPool = null;
    }
    return false;
  }
}

async function initDatabase() {
  console.log('🔄 Memulai inisialisasi koneksi database...');
  
  const hasPg = !!(process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.PGHOST);
  const hasMysql = !!(process.env.DB_HOST && process.env.DB_NAME);

  if (hasPg) {
    console.log('🔌 Mencoba menyambung ke PostgreSQL/Supabase...');
    const pgSuccess = await connectToPostgres();
    if (pgSuccess) {
      return;
    }
    console.log(`⚠️ Gagal menyambung ke PostgreSQL/Supabase: ${dbErrorMsg}`);
  } else if (hasMysql) {
    console.log('🔌 Mencoba menyambung ke MySQL...');
    const mysqlSuccess = await connectToMySQL();
    if (mysqlSuccess) {
      return;
    }
    console.log(`⚠️ Gagal menyambung ke MySQL: ${dbErrorMsg}`);
  } else {
    dbErrorMsg = 'Kredensial database (PostgreSQL/Supabase atau MySQL) tidak ditemukan di Environment Variables.';
    console.log('⚠️ Tidak ada kredensial database yang dikonfigurasi.');
  }

  console.log('⚠️ Database Cloud tidak aktif. Menjalankan fallback database JSON lokal.');
  dbMode = 'fallback';
  isDbConnected = false;
}

initDatabase();

// Unified DB Query Adapter
async function dbQuery(sql: string, params: any[] = []): Promise<{ rows: any[], insertId: any }> {
  if (dbMode === 'postgres' && pgPool) {
    let pgSql = sql;
    
    // Convert ON DUPLICATE KEY UPDATE syntax from MySQL to PostgreSQL
    if (sql.includes('ON DUPLICATE KEY UPDATE')) {
      pgSql = sql.replace(
        'INSERT INTO kompetensi (user_id, key_kompetensi, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?',
        'INSERT INTO kompetensi (user_id, key_kompetensi, status) VALUES ($1, $2, $3) ON CONFLICT (user_id, key_kompetensi) DO UPDATE SET status = EXCLUDED.status'
      );
    }
    
    // Replace MySQL parameter placeholder "?" with PostgreSQL "$1, $2..."
    let paramIndex = 1;
    let index = pgSql.indexOf('?');
    while (index !== -1) {
      pgSql = pgSql.substring(0, index) + '$' + paramIndex + pgSql.substring(index + 1);
      paramIndex++;
      index = pgSql.indexOf('?');
    }

    // Strip out MySQL backticks (`) which PostgreSQL does not support for tables/columns
    pgSql = pgSql.replace(/`/g, '');

    // For PostgreSQL INSERT/UPDATE, auto-append "RETURNING *" so we get the results back directly
    if (pgSql.trim().toUpperCase().startsWith('INSERT') || pgSql.trim().toUpperCase().startsWith('UPDATE')) {
      if (!pgSql.toUpperCase().includes('RETURNING')) {
        pgSql += ' RETURNING *';
      }
    }

    const pgParams = pgSql.includes('ON CONFLICT') ? params.slice(0, 3) : params;
    const res = await pgPool.query(pgSql, pgParams);
    const rows = res.rows;
    const insertId = rows[0]?.id || null;
    return { rows, insertId };
  } else if (dbMode === 'mysql' && mysqlPool) {
    const [rows]: any = await mysqlPool.query(sql, params);
    const insertId = rows?.insertId || null;
    return { rows, insertId };
  } else {
    throw new Error('Database not connected in an active mode');
  }
}

// =============================================================
// API ROUTES
// =============================================================

// Get Database Status (Visual Indicator untuk user)
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: isDbConnected,
    mode: dbMode === 'postgres' ? 'Supabase PostgreSQL Active (Terkoneksi Supabase Cloud)' : dbMode === 'mysql' ? 'MySQL Active (Terkoneksi phpMyAdmin)' : 'Fallback Local Database (server_db.json)',
    host: dbMode === 'postgres' ? 'db.supabase.co' : (process.env.DB_HOST || 'belum diatur'),
    database: dbMode === 'postgres' ? 'postgres' : (process.env.DB_NAME || 'belum diatur'),
    error: dbErrorMsg || null
  });
});

// 1. REGISTER USER
app.post('/api/auth/register', async (req, res) => {
  const { nama, nis, sekolah, kelas, email, password } = req.body;

  if (!nama || !nis || !email || !password) {
    return res.status(400).json({ error: 'Data registrasi tidak lengkap' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (dbMode !== 'fallback') {
    try {
      // Check if email already registered
      const { rows: existing } = await dbQuery('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Alamat email sudah terdaftar' });
      }

      // Insert new user
      const { rows: insertRows, insertId } = await dbQuery(
        "INSERT INTO users (nama, nis, sekolah, kelas, email, password, role) VALUES (?, ?, ?, ?, ?, ?, 'user')",
        [nama, nis, sekolah || 'SMK Negeri 1 Tanjungpinang', kelas || 'XII TKJ 1', normalizedEmail, password]
      );

      const userId = insertId || insertRows[0]?.id;
      const { rows: newUser } = await dbQuery('SELECT * FROM users WHERE id = ?', [userId]);

      return res.json({ success: true, user: newUser[0] });
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal register ke database: ' + err.message });
    }
  } else {
    // FALLBACK DATABASE
    const db = readFallbackDb();
    const existing = db.users.find((u: any) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'Alamat email sudah terdaftar' });
    }

    const newUser = {
      id: Date.now(),
      nama,
      nis,
      sekolah: sekolah || 'SMK Negeri 1 Tanjungpinang',
      jurusan: 'Teknik Komputer dan Jaringan (TKJ)',
      kelas: kelas || 'XII TKJ 1',
      email: normalizedEmail,
      password,
      role: 'user',
      pembimbing: '',
      tempat_pkl: '',
      pembimbing_industri: '',
      tanggal_mulai: '',
      tanggal_selesai: ''
    };

    db.users.push(newUser);
    writeFallbackDb(db);

    return res.json({ success: true, user: newUser });
  }
});

// 2. LOGIN USER
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password harus diisi' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (dbMode !== 'fallback') {
    try {
      const { rows } = await dbQuery(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [normalizedEmail, password]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Email atau password salah' });
      }

      return res.json({ success: true, user: rows[0] });
    } catch (err: any) {
      return res.status(500).json({ error: 'Koneksi database bermasalah: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    const found = db.users.find(
      (u: any) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!found) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    return res.json({ success: true, user: found });
  }
});

// 3. UPDATE PROFILE
app.post('/api/auth/update-profile', async (req, res) => {
  const { id, nama, nis, sekolah, kelas, email, password, pembimbing, tempat_pkl, pembimbing_industri, tanggal_mulai, tanggal_selesai } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID user diperlukan untuk update profil' });
  }

  if (dbMode !== 'fallback') {
    try {
      await dbQuery(
        'UPDATE users SET nama = ?, nis = ?, sekolah = ?, kelas = ?, email = ?, password = ?, pembimbing = ?, tempat_pkl = ?, pembimbing_industri = ?, tanggal_mulai = ?, tanggal_selesai = ? WHERE id = ?',
        [
          nama, 
          nis, 
          sekolah || 'SMK Negeri 1 Tanjungpinang', 
          kelas || 'XII TKJ', 
          email.toLowerCase().trim(), 
          password, 
          pembimbing || '', 
          tempat_pkl || '',
          pembimbing_industri || '',
          tanggal_mulai || '',
          tanggal_selesai || '',
          id
        ]
      );

      const { rows: updated } = await dbQuery('SELECT * FROM users WHERE id = ?', [id]);
      return res.json({ success: true, user: updated[0] });
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal update profil: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    const index = db.users.findIndex((u: any) => u.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const updatedUser = {
      ...db.users[index],
      nama,
      nis,
      sekolah: sekolah || 'SMK Negeri 1 Tanjungpinang',
      kelas: kelas || 'XII TKJ',
      email: email.toLowerCase().trim(),
      password,
      pembimbing: pembimbing || '',
      tempat_pkl: tempat_pkl || '',
      pembimbing_industri: pembimbing_industri || '',
      tanggal_mulai: tanggal_mulai || '',
      tanggal_selesai: tanggal_selesai || ''
    };

    db.users[index] = updatedUser;
    writeFallbackDb(db);

    return res.json({ success: true, user: updatedUser });
  }
});

// 4. GET JURNALS (Berdasarkan user_id)
app.get('/api/jurnals', async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'user_id diperlukan' });
  }

  if (dbMode !== 'fallback') {
    try {
      const { rows } = await dbQuery(
        'SELECT * FROM jurnals WHERE user_id = ? ORDER BY id DESC',
        [userId]
      );
      return res.json(rows);
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal mengambil jurnal: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    const userJurnals = db.jurnals.filter((j: any) => j.user_id === Number(userId));
    userJurnals.sort((a: any, b: any) => b.id - a.id);
    return res.json(userJurnals);
  }
});

// 5. POST JURNAL NEW ENTRY
app.post('/api/jurnals', async (req, res) => {
  const { user_id, judul, isi, tanggal, kategori } = req.body;

  if (!user_id || !judul || !isi || !tanggal || !kategori) {
    return res.status(400).json({ error: 'Data jurnal tidak lengkap' });
  }

  if (dbMode !== 'fallback') {
    try {
      const { rows: insertRows, insertId } = await dbQuery(
        'INSERT INTO jurnals (user_id, judul, isi, tanggal, kategori) VALUES (?, ?, ?, ?, ?)',
        [user_id, judul, isi, tanggal, kategori]
      );
      const insertIdValue = insertId || insertRows[0]?.id;
      const { rows: newJurnal } = await dbQuery('SELECT * FROM jurnals WHERE id = ?', [insertIdValue]);
      return res.json(newJurnal[0]);
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal menyimpan jurnal: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    const newJurnal = {
      id: Date.now(),
      user_id: Number(user_id),
      judul,
      isi,
      tanggal,
      kategori
    };
    db.jurnals.unshift(newJurnal);
    writeFallbackDb(db);
    return res.json(newJurnal);
  }
});

// 6. DELETE JURNAL ENTRY
app.delete('/api/jurnals/:id', async (req, res) => {
  const id = req.params.id;

  if (dbMode !== 'fallback') {
    try {
      await dbQuery('DELETE FROM jurnals WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Jurnal harian terhapus' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal menghapus jurnal: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    const filtered = db.jurnals.filter((j: any) => j.id !== Number(id));
    db.jurnals = filtered;
    writeFallbackDb(db);
    return res.json({ success: true, message: 'Jurnal harian terhapus' });
  }
});

// 7. GET ALL VIDEOS
app.get('/api/videos', async (req, res) => {
  if (dbMode !== 'fallback') {
    try {
      const { rows } = await dbQuery('SELECT * FROM videos ORDER BY id DESC');
      const formatted = rows.map((r: any) => ({
        ...r,
        steps: r.steps ? r.steps.split('\n').filter((s: string) => s.trim().length > 0) : []
      }));
      return res.json(formatted);
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal mengambil video: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    const list = [...db.videos].sort((a: any, b: any) => b.id - a.id);
    return res.json(list);
  }
});

// 8. POST VIDEO TUTORIAL (Hanya admin!)
app.post('/api/videos', async (req, res) => {
  const { title, video_url, category, difficulty, duration, description, steps } = req.body;

  if (!title || !video_url || !category || !steps) {
    return res.status(400).json({ error: 'Data video tidak lengkap' });
  }

  const stepsString = Array.isArray(steps) ? steps.join('\n') : steps;
  const stepsArray = Array.isArray(steps) ? steps : steps.split('\n').filter((s: string) => s.trim().length > 0);

  if (dbMode !== 'fallback') {
    try {
      const { rows: insertRows, insertId } = await dbQuery(
        'INSERT INTO videos (title, video_url, category, difficulty, duration, description, steps) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          title, 
          video_url, 
          category, 
          difficulty || 'Sedang', 
          duration || '10:00', 
          description || 'Tidak ada deskripsi', 
          stepsString
        ]
      );
      const insertIdValue = insertId || insertRows[0]?.id;
      const { rows: newVideo } = await dbQuery('SELECT * FROM videos WHERE id = ?', [insertIdValue]);
      
      const formatted = {
        ...newVideo[0],
        steps: stepsArray
      };

      return res.json(formatted);
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal menyimpan video ke database: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    const newVideo = {
      id: Date.now(),
      title,
      video_url,
      category,
      difficulty: difficulty || 'Sedang',
      duration: duration || '10:00',
      description: description || 'Tidak ada deskripsi',
      steps: stepsArray,
      views: '0 views'
    };

    db.videos.unshift(newVideo);
    writeFallbackDb(db);
    return res.json(newVideo);
  }
});

// 9. DELETE VIDEO TUTORIAL
app.delete('/api/videos/:id', async (req, res) => {
  const id = req.params.id;

  if (dbMode !== 'fallback') {
    try {
      await dbQuery('DELETE FROM videos WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Video tutorial terhapus dari database' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal menghapus video: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    const filtered = db.videos.filter((v: any) => v.id !== Number(id));
    db.videos = filtered;
    writeFallbackDb(db);
    return res.json({ success: true, message: 'Video tutorial terhapus' });
  }
});

// 10. GET USER KOMPETENSI
app.get('/api/kompetensi', async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'user_id diperlukan' });
  }

  if (dbMode !== 'fallback') {
    try {
      const { rows } = await dbQuery(
        'SELECT key_kompetensi, status FROM kompetensi WHERE user_id = ?',
        [userId]
      );
      
      const formatted: { [key: string]: string } = {};
      rows.forEach((row: any) => {
        formatted[row.key_kompetensi] = row.status;
      });
      return res.json(formatted);
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal mengambil kompetensi: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    if (!db.kompetensi) {
      db.kompetensi = [];
    }
    const userComps = db.kompetensi.filter((c: any) => c.user_id === Number(userId));
    const formatted: { [key: string]: string } = {};
    userComps.forEach((c: any) => {
      formatted[c.key_kompetensi] = c.status;
    });
    return res.json(formatted);
  }
});

// 11. UPDATE OR INSERT USER KOMPETENSI
app.post('/api/kompetensi', async (req, res) => {
  const { user_id, key_kompetensi, status } = req.body;

  if (!user_id || !key_kompetensi || !status) {
    return res.status(400).json({ error: 'Data kompetensi tidak lengkap' });
  }

  if (dbMode !== 'fallback') {
    try {
      await dbQuery(
        'INSERT INTO kompetensi (user_id, key_kompetensi, status) VALUES (?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE status = ?',
        [user_id, key_kompetensi, status, status]
      );
      return res.json({ success: true, key_kompetensi, status });
    } catch (err: any) {
      return res.status(500).json({ error: 'Gagal mengupdate kompetensi: ' + err.message });
    }
  } else {
    // FALLBACK
    const db = readFallbackDb();
    if (!db.kompetensi) {
      db.kompetensi = [];
    }
    
    const index = db.kompetensi.findIndex(
      (c: any) => c.user_id === Number(user_id) && c.key_kompetensi === key_kompetensi
    );

    if (index !== -1) {
      db.kompetensi[index].status = status;
    } else {
      db.kompetensi.push({
        id: Date.now() + Math.random(),
        user_id: Number(user_id),
        key_kompetensi,
        status
      });
    }

    writeFallbackDb(db);
    return res.json({ success: true, key_kompetensi, status });
  }
});


// -------------------------------------------------------------
// SERVING FRONTEND VITE APP / VERCEL COMPATIBILITY
// -------------------------------------------------------------
async function startServer() {
  // If running on Vercel, static files are served by Vercel CDN and port binding is serverless.
  if (process.env.VERCEL) {
    console.log('⚡ SMART INFORMAX: Server running in Vercel Serverless environment.');
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 SMART INFORMAX Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
