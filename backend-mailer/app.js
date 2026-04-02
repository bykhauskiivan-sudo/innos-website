"use strict";

const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

const maxFileSizeBytes = 50 * 1024 * 1024;
const targetEmail = process.env.TARGET_EMAIL || "contact@investstanok.ru";
const smtpUser = process.env.YANDEX_SMTP_USER || "";
const smtpPass = process.env.YANDEX_SMTP_PASS || "";
const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSizeBytes }
});

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin is not allowed by CORS"));
  }
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

const normalizeValue = (value) => String(value || "").trim();
const allowedExtensionSet = new Set([".doc", ".docx", ".xls", ".xlsx", ".zip", ".rar"]);
const allowedImageMimePrefix = "image/";
const getFileExtension = (fileName) => {
  const normalizedName = String(fileName || "").toLowerCase().trim();
  const lastDotIndex = normalizedName.lastIndexOf(".");
  if (lastDotIndex <= 0 || lastDotIndex === normalizedName.length - 1) {
    return "";
  }
  return normalizedName.slice(lastDotIndex);
};
const isAllowedAttachment = (file) => {
  if (!file) {
    return true;
  }
  const extension = getFileExtension(file.originalname);
  const mimeType = String(file.mimetype || "").toLowerCase();
  if (mimeType.startsWith(allowedImageMimePrefix)) {
    return true;
  }
  return allowedExtensionSet.has(extension);
};

const buildDateToken = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const dd = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  return `${hh}:${mm} ${dd}.${month}.${yyyy}`;
};

const buildMailText = (payload) =>
  [
    "Новая заявка INNOS",
    "",
    `Имя представителя: ${payload.name}`,
    `Организация (ИНН): ${payload.company}`,
    `Телефон: ${payload.phone}`,
    `E-mail: ${payload.email}`,
    `Задача: ${payload.task}`,
    `Файл: ${payload.fileName}`
  ].join("\n");

const healthPaths = ["/api/health", "/health", "/.netlify/functions/api/health"];
const sendRequestPaths = ["/api/send-request", "/send-request", "/.netlify/functions/api/send-request"];

app.get(healthPaths, (_req, res) => {
  res.json({ ok: true, service: "innos-mailer" });
});

app.post(sendRequestPaths, upload.single("contact_attachment"), async (req, res) => {
  try {
    if (!smtpUser || !smtpPass) {
      res.status(500).json({
        ok: false,
        error: "SMTP credentials are not configured"
      });
      return;
    }

    const file = req.file || null;
    if (file && !isAllowedAttachment(file)) {
      res.status(400).json({
        ok: false,
        error: "Unsupported file type. Allowed: images, Word (.doc/.docx), Excel (.xls/.xlsx), ZIP, RAR"
      });
      return;
    }

    const payload = {
      name: normalizeValue(req.body.contact_name),
      company: normalizeValue(req.body.contact_company),
      phone: normalizeValue(req.body.contact_phone),
      email: normalizeValue(req.body.contact_email),
      task: normalizeValue(req.body.contact_task),
      fileName: file ? normalizeValue(file.originalname || "attachment") : "не прикреплен"
    };

    if (!payload.name || !payload.company || !payload.phone || !payload.email || !payload.task) {
      res.status(400).json({ ok: false, error: "All fields are required" });
      return;
    }

    const subject = `innos TZ ${buildDateToken(new Date())}`;
    const text = buildMailText(payload);

    const message = {
      from: smtpUser,
      to: targetEmail,
      replyTo: payload.email,
      subject,
      text
    };

    if (file) {
      message.attachments = [
        {
          filename: payload.fileName,
          content: file.buffer,
          contentType: file.mimetype || "application/octet-stream"
        }
      ];
    }

    await transporter.sendMail(message);

    res.json({ ok: true, message: "Email sent" });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Failed to send email",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.use((error, _req, res, _next) => {
  if (error && error.message === "Origin is not allowed by CORS") {
    res.status(403).json({ ok: false, error: "CORS blocked for this origin" });
    return;
  }

  if (error && error.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({ ok: false, error: "File too large. Max size is 50 MB" });
    return;
  }

  res.status(500).json({ ok: false, error: "Internal server error" });
});

module.exports = app;
