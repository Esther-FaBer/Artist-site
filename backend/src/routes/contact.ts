import { Router, Request, Response, NextFunction } from 'express'
import nodemailer from 'nodemailer'
import { query } from '../lib/db'

const router = Router()

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// POST /api/contact

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, type, subject, message, artworkId } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      res.status(400).json({
        error: 'Name, email, subject and message are required'
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email address' })
      return
    }

    // Save to database

    const result = await query(`
      INSERT INTO enquiries (name, email, type, subject, message, artwork_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      name,
      email,
      type ?? 'GENERAL',
      subject,
      message,
      artworkId ? Number(artworkId) : null,
    ])

    const enquiry = result.rows[0]

    // Send email notification
 
    const artistEmail = process.env.EMAIL_TO
    if (artistEmail) {
      transporter
        .sendMail({
          from:    process.env.EMAIL_USER,
          to:      artistEmail,
          subject: `New ${type ?? 'general'} enquiry — ${subject}`,
          text:    `From: ${name} <${email}>\n\n${message}`,
          html: `
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Type:</strong> ${type ?? 'General'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <p>${message.replace(/\n/g, '<br />')}</p>
          `,
        })
        .catch((err: Error) => {
          console.error('Email notification failed:', err.message)
        })
    }

    res.status(201).json({
      message: 'Thank you for your message.',
      id:      enquiry.id,
    })
  } catch (err) {
    next(err)
  }
})

export default router