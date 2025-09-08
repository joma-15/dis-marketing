import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // load env variables first

const app = express();

// setup storage (make sure "uploads" folder exists in your project root)
const upload = multer({ dest: "uploads/" });

// configure transporter (SendGrid)
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey", // always literally "apikey"
    pass: process.env.SENDGRID_API_KEY, // must be in your .env
  },
});

// route to handle file upload + email
app.post("/upload", upload.single("proofImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const mailOptions = {
      from: "adelzarajhonmarcel@gmail.com", // must be verified sender in SendGrid
      to: "adelzarajhonmarcel@gmail.com",
      subject: "New Proof of Payment",
      text: "A user has uploaded a proof of payment.",
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "File uploaded and emailed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
