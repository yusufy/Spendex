import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import cors from "cors";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();

if (process.env.NODE_ENV === "production") job.start();

const app = express();


app.use(rateLimiter);
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);

console.log("my port is:",process.env.PORT);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port:",PORT);
    });
});