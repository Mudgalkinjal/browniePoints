"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465, // Use true if port is 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true, // Enable logging
    debug: true, // Enable debug information
});
// Verify the transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Connection Error:', error);
    }
    else {
        console.log('SMTP Server is ready to send emails');
    }
});
exports.default = transporter;
