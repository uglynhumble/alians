import nodemailer from "nodemailer";

const required = ["SMTP_HOST", "SMTP_USER"];
const missing = required.filter((name) => !process.env[name]);
if (!process.env.SMTP_PASSWORD) missing.push("SMTP_PASSWORD");
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const port = Number(process.env.SMTP_PORT || 587);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  requireTLS: port !== 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  tls: { minVersion: "TLSv1.2" },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 15_000,
});

try {
  await transporter.verify();
  console.log(`SMTP OK: ${process.env.SMTP_HOST}:${port}, user ${process.env.SMTP_USER}`);
} catch (error) {
  console.error("SMTP check failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  transporter.close();
}
