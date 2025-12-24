import express from "express";
import { getTransactionsByUserId, createTransaction, deleteTransaction, getSummaryByUserId } from "../controllers/transactionsController.js";

const router = express.Router();

// IMPORTANT: Specific routes must come BEFORE dynamic parameter routes
// Otherwise /:user_id will match "summary" as a user_id
router.get("/summary/:user_id", getSummaryByUserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

// This must be LAST because /:user_id matches any string
router.get("/:user_id", getTransactionsByUserId);

export default router;