import nodemailer from "nodemailer";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";

function sendEmail() {
  const app = express();
  dotenv.config();

  //setup storage
  const upload = multer({ dest: "uploads/" }); //the file will go there

  //this is the one who will send the gmail

  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  app.post("/upload", upload.single("proofImage"), async (req, res) => {
    try {
      const mailOptions = {
        from: "no reply '<adelzarajhonmarcel@gmail.com>'",
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

  //start live server
  // app.listen(3000, () => {
  //     console.log('server is currently running at http://localhost:3000');
  // })

  app.listen(3000, () => {
    console.log("the server is currently running");
  });
}
sendEmail();
