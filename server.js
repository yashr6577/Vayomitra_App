const express = require("express");
const twilio = require("twilio");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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

app.post("/make-call", async (req, res) => {
  try {
    await client.calls.create({
      twiml: `<Response>
                <Say loop="3">Help me! I am in an emergency. Caretaker, I am at Government College of Engineering Aurangabad.</Say>
              </Response>`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.RECEIVER_PHONE_NUMBER,
    });
    res.send({ success: true, message: "Emergency call placed successfully!" });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log(`✅ Server running on port 5000`));