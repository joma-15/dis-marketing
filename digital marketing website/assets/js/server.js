yimport express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); // allow frontend on 127.0.0.1:5500
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup storage (make sure "uploads" folder exists in your project root)
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// configure transporter (SendGrid)
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

// route to handle file upload + email
app.post("/upload", upload.single("proofImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const amount = req.body.amount || "Not specified";
    const reference = req.body.reference || "Not specified";

    const mailOptions = {
      from: "adelzarajhonmarcel@gmail.com", // must be verified sender in SendGrid
      to: "adelzarajhonmarcel@gmail.com",
      subject: "New Proof of Payment",
      text: `A user has uploaded a proof of payment.
      
Payment Details:
- Amount: ₱${amount}
- Reference Number: ${reference}
- File: ${req.file.originalname}`,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "File uploaded and emailed successfully!",
      amount,
      reference,
    });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 10MB." });
    }
  }

  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({ message: error.message });
  }

  console.error("Server error:", error);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
