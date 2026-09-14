const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// Middleware
app.use(cors());          // дозволи барања од Flutter/Web
app.use(express.json());  // парсира JSON body

// Тест рута
app.get("/", (req, res) => {
  res.send("Brevo server is running ✅");
});

// Рута за праќање email
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, htmlContent } = req.body;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY   // MCP во header
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error sending email" });
  }
});

// Старт на сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
