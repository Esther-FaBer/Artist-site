import { Router, Request, Response, NextFunction } from "express";
import { query } from "../lib/db";

const router = Router();

// POST /api/contact
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, enquiry_type, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email and message are required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }

    const result = await query(
      `INSERT INTO enquiries (name, email, enquiry_type, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, email, enquiry_type ?? "GENERAL", message],
    );

    res.status(201).json({
      message: "Thank you for your message.",
      id: result.rows[0].id,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
