import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// GET /api/bio
router.get("/", async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT id, section_type, heading, body, display_order
       FROM bio
       ORDER BY display_order ASC`,
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

export default router;
