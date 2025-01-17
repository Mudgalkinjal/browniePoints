import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: parseInt(process.env.SMTP_PORT || '587') === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
})

// Verify the transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error)
  } else {
    console.log('SMTP Server is ready to send emails')
  }
})

export default transporter
