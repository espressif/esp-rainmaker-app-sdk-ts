import nodemailer from "nodemailer";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Required environment variables
const requiredVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "EMAIL_USER",
  "EMAIL_PASSWORD",
  "TO_EMAILS",
  "CI_PIPELINE_URL",
  "CI_COMMIT_REF_NAME",
  "CI_PROJECT_URL",
  "CI_PROJECT_NAME",
  "CI_PAGES_URL",
  "CI_COMMIT_SHA",
  "CI_COMMIT_SHORT_SHA",
  "CI_COMMIT_MESSAGE",
];

// Validate required environment variables
const missingVars = requiredVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingVars.join(", ")
  );
  process.exit(1);
}

// Debug logs
console.log("=== Email Configuration Debug ===");
console.log("SMTP Host:", process.env.SMTP_HOST);
console.log("SMTP Port:", process.env.SMTP_PORT);
console.log("SMTP Secure:", process.env.SMTP_SECURE === "true");
console.log("Email User:", process.env.EMAIL_USER);
console.log("To Emails:", process.env.TO_EMAILS);
console.log("=== End Configuration Debug ===");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test SMTP connection
console.log("Testing SMTP connection...");
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP Connection Error:", error);
    process.exit(1);
  } else {
    console.log("SMTP Connection Successful!");
  }
});

// Read and compile the Handlebars template
const templatePath = path.join(__dirname, "test-results-email-template.html");
console.log("Loading template from:", templatePath);

try {
  const template = fs.readFileSync(templatePath, "utf8");
  const compiledTemplate = Handlebars.compile(template);

  // Format commit message: Split into title and body
  const formatCommitMessage = (message) => {
    const [title, ...body] = message.split("\n").map((line) => line.trim());
    return {
      title: title || "",
      body: body.filter((line) => line.length > 0).join("\n") || "",
    };
  };

  // Prepare the data for the template
  const data = {
    pipelineURL: process.env.CI_PIPELINE_URL,
    testReportURL: `${process.env.CI_PIPELINE_URL}/test_report?job_name=unit_tests`,
    testCoverageReportURL: `${process.env.CI_PAGES_URL}`,
    branchName: process.env.CI_COMMIT_REF_NAME,
    projectURL: process.env.CI_PROJECT_URL,
    projectName: process.env.CI_PROJECT_NAME,
    commitShortSHA: process.env.CI_COMMIT_SHORT_SHA,
    commitMessage: formatCommitMessage(process.env.CI_COMMIT_MESSAGE),
    commitURL: `${process.env.CI_PROJECT_URL}/-/commit/${process.env.CI_COMMIT_SHA}`,
  };

  // Render the template with the data
  const html = compiledTemplate(data);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.TO_EMAILS,
    subject: `[${data.projectName}] Test Report - ${new Date().toISOString().split("T")[0]}`,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      process.exit(1);
    } else {
      console.log("Email sent:", info.response);
      process.exit(0);
    }
  });
} catch (error) {
  console.error("Error reading template file:", error);
  process.exit(1);
}
