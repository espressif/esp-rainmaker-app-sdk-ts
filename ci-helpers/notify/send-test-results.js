/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Script to send test results to the email address(es) specified in the TO_EMAILS environment variable.
 * This script is used in the CI/CD pipeline at the notify_test_results job to notify the test results.
 */

import nodemailer from "nodemailer";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import {
  formatMessage,
  formatCommitMessage,
  validateEnvVars,
  ANSI_CODES,
} from "../utils.js";

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
  "ANSI_BOLD_ITALIC_CODE",
  "ANSI_RESET_CODE",
];

try {
  // Validate required environment variables
  validateEnvVars(requiredVars);

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
  console.log(
    formatMessage("Testing SMTP connection...", ANSI_CODES.BOLD_ITALIC)
  );
  transporter.verify(function (error) {
    if (error) {
      console.error(
        formatMessage(`SMTP Connection Error: ${error}`, ANSI_CODES.BOLD_ITALIC)
      );
      process.exit(1);
    } else {
      console.log(
        formatMessage("SMTP Connection Successful!", ANSI_CODES.BOLD_ITALIC)
      );
    }
  });

  // Read and compile the Handlebars template
  const templatePath = path.join(__dirname, "test-results-email-template.html");
  const template = fs.readFileSync(templatePath, "utf8");
  const compiledTemplate = Handlebars.compile(template);

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
      console.error(
        formatMessage(`Error sending email: ${error}`, ANSI_CODES.BOLD_ITALIC)
      );
      process.exit(1);
    } else {
      console.log(
        formatMessage(`Email sent: ${info.response}`, ANSI_CODES.BOLD_ITALIC)
      );
      process.exit(0);
    }
  });
} catch (error) {
  console.error(
    formatMessage(`Error: ${error.message}`, ANSI_CODES.BOLD_ITALIC)
  );
  process.exit(1);
}
