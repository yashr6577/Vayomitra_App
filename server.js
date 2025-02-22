const express = require("express");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post("/send-sms", async (req, res) => {
  try {
    await client.messages.create({
      body: req.body.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.RECEIVER_PHONE_NUMBER,
    });
    res.send({ success: true, message: "SMS sent successfully!" });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: req.body.subject,
      text: req.body.body,
    });
    res.send({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log(`✅ Server running on port 5000`));