import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import crypto from "crypto";
import fs from "fs";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// CORS setup
const prodOrigins = [process.env.ORIGIN_1, process.env.ORIGIN_2];
const devOrigin = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5500"];
const allowedOrigins =
  process.env.NODE_ENV === "production" ? prodOrigins : devOrigin;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bioqr",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to database.");
});

// Enhanced error logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ✅ Registration route
app.post("/bioqr/users/register", async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;

  console.log('📝 Registration attempt:', { first_name, last_name, username, email });

  if (!first_name || !last_name || !username || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], async (err, result) => {
    if (err) {
      console.error("❌ Error checking email:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length > 0) {
      return res.json({ success: false, message: "Email already registered" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query =
        "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)";
      db.query(
        query,
        [first_name, last_name, username, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("❌ DB insert error:", err);
            return res
              .status(500)
              .json({ success: false, message: "Database error" });
          }
          console.log("✅ User registered successfully:", result.insertId);
          res.json({ 
            success: true, 
            message: "User registered successfully!",
            user_id: result.insertId
          });
        }
      );
    } catch (error) {
      console.error("❌ Error hashing password:", error);
      res.json({ success: false, message: "Error hashing password" });
    }
  });
});

// ✅ Login route
app.post("/bioqr/users/login", (req, res) => {
  const { email, password } = req.body;

  console.log('📝 Login attempt:', { email });

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, result) => {
    if (err) {
      console.error("❌ DB query error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      console.log("✅ Login successful:", user.id);
      return res.json({
        success: true,
        message: "Login successful",
        user_id: user.id,
        username: user.username,
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

// ✅ Multer setup with enhanced error handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    console.log('📁 Saving file as:', uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 File upload attempt:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    cb(null, true);
  }
});

// ✅ File Upload with enhanced error handling
app.post("/bioqr/files/upload", (req, res) => {
  console.log('📁 Upload request received');
  
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({ 
        success: false, 
        message: `Upload error: ${err.message}` 
      });
    }

    const { user_id } = req.body;
    const file = req.file;

    console.log('📁 Upload data:', { user_id, file: file ? file.filename : 'no file' });

    if (!user_id) {
      return res.status(400).json({ 
        success: false, 
        message: "user_id is required" 
      });
    }

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }

    const query =
      "INSERT INTO files (user_id, filename, mimetype, filepath) VALUES (?, ?, ?, ?)";
    
    db.query(
      query,
      [user_id, file.originalname, file.mimetype, file.path],
      (err, result) => {
        if (err) {
          console.error("❌ DB insert error:", err);
          return res.status(500).json({ 
            success: false, 
            message: `Database error: ${err.message}` 
          });
        }
        
        console.log("✅ File uploaded successfully:", result.insertId);
        res.json({ 
          success: true, 
          message: "File uploaded successfully!",
          file_id: result.insertId
        });
      }
    );
  });
});

// ✅ Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Get all files for a user
app.get("/bioqr/files/:userId", (req, res) => {
  const userId = req.params.userId;
  console.log('📁 Fetching files for user:', userId);

  db.query(
    "SELECT id, filename, mimetype, filepath, uploaded_at FROM files WHERE user_id = ? ORDER BY uploaded_at DESC",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.BASE_URL || 'http://localhost:3000'
        : 'http://localhost:3000';

      const files = rows.map((f) => ({
        id: f.id,
        filename: f.filename,
        mimetype: f.mimetype,
        url: `${baseUrl}/${f.filepath.replace(/\\/g, "/")}`,
        uploaded_at: f.uploaded_at,
      }));

      console.log('✅ Found files:', files.length);
      res.json({ files });
    }
  );
});

// ✅ Download file
app.get("/bioqr/files/download/:id", (req, res) => {
  const fileId = req.params.id;

  db.query(
    "SELECT filename, filepath FROM files WHERE id = ?",
    [fileId],
    (err, rows) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(404).send("File not found");
      }
      
      if (!rows.length) {
        return res.status(404).send("File not found");
      }

      const filePath = path.resolve(rows[0].filepath);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error("❌ File not found on disk:", filePath);
        return res.status(404).send("File not found on disk");
      }

      res.download(filePath, rows[0].filename);
    }
  );
});

// ✅ Generate QR code for file
app.post("/bioqr/generate-qr", async (req, res) => {
  try {
    const { user_id, file_id } = req.body;

    if (!user_id || !file_id) {
      return res.status(400).json({ error: "user_id and file_id required" });
    }

    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const query =
      "INSERT INTO qr_tokens (token, user_id, file_id, expires_at) VALUES (?, ?, ?, ?)";
    db.query(query, [token, user_id, file_id, expiresAt], async (err) => {
      if (err) {
        console.error("❌ DB insert error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.BASE_URL || 'http://localhost:3000'
        : 'http://localhost:3000';

      const qrData = `${baseUrl}/access-file/${token}`;
      const qrImage = await QRCode.toDataURL(qrData);

      console.log("✅ QR code generated for token:", token);
      res.json({ qrImage, token, expiresAt });
    });
  } catch (err) {
    console.error("❌ QR generation error:", err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
});

// ✅ Access file with QR
app.get("/access-file/:token", (req, res) => {
  const { token } = req.params;

  const query =
    "SELECT * FROM qr_tokens WHERE token = ? AND expires_at > NOW()";
  db.query(query, [token], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: "Invalid or expired QR code" 
      });
    }

    const fileId = result[0].file_id;
    db.query("SELECT * FROM files WHERE id = ?", [fileId], (err, fileResult) => {
      if (err || fileResult.length === 0) {
        console.error("❌ File not found:", fileId);
        return res.status(404).json({ 
          success: false, 
          message: "File not found" 
        });
      }

      const file = fileResult[0];
      const filePath = path.resolve(file.filepath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          success: false, 
          message: "File not found on disk" 
        });
      }

      res.download(filePath, file.filename);
    });
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});