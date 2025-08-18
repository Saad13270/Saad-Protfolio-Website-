const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

// Email configuration - only create transporter if email credentials are available
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Stricter rate limit for contact form to prevent abuse
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many contact requests from this IP, please try again later.'
});

// Basic sanitization to avoid header injection and excessive payloads
function sanitizeInput(input, maxLen = 1000) {
  if (typeof input !== 'string') return '';
  // Remove CR/LF to prevent header injection
  const noBreaks = input.replace(/[\r\n]/g, ' ');
  // Trim and cap length
  return noBreaks.trim().slice(0, maxLen);
}

// POST /api/contact
router.post('/', contactLimiter, async (req, res) => {
  try {
    const rawName = req.body?.name;
    const rawEmail = req.body?.email;
    const rawSubject = req.body?.subject;
    const rawMessage = req.body?.message;

    // Validation
    if (!rawName || !rawEmail || !rawSubject || !rawMessage) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, subject, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Sanitize and enforce reasonable limits
    const name = sanitizeInput(rawName, 100);
    const email = sanitizeInput(rawEmail, 254);
    const subject = sanitizeInput(rawSubject, 150);
    const message = sanitizeInput(rawMessage, 5000);

    // Check if email is configured
    if (!transporter) {
      return res.status(503).json({
        error: 'Email service not configured',
        message: 'Contact form is currently unavailable. Please try again later or contact directly via email.'
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="margin-top: 20px; font-size: 12px; color: #666;">
            <p>This message was sent from your portfolio website contact form.</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
        
        Timestamp: ${new Date().toISOString()}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Log the contact attempt
    console.log(`Contact form submitted by ${name} (${email})`);

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    res.status(500).json({
      error: 'Failed to send message',
      message: 'There was an error sending your message. Please try again later.'
    });
  }
});

// GET /api/contact (for testing)
router.get('/', (req, res) => {
  res.json({
    message: 'Contact API endpoint',
    method: 'POST',
    required_fields: ['name', 'email', 'subject', 'message']
  });
});

module.exports = router;
