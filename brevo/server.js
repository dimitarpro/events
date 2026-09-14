const express = require("express");
const cors = require("cors");
const brevo = require("@getbrevo/brevo");

const app = express();
app.use(express.json());

// ✅ CORS middleware
app.use(cors({ origin: "*" }));

// ✅ Дополнителни headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// ✅ Brevo API key
const client = new brevo.TransactionalEmailsApi();
client.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// ✅ Email рута
app.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;
  console.log("Request body:", req.body);

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: "Dimitar", email: process.env.BREVO_FROM };
    sendSmtpEmail.to = [{ email: to }];

    const result = await client.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent:", result.messageId);
    res.json({ success: true, id: result.messageId });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
