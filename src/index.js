import express from "express";
import connectToDB from "./db/db.js";
import dotenv from 'dotenv';
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectToDB();

app.use(express.json());

app.use('/api', userRouter);

app.listen(PORT, () => {
  console.log(`✅ Auth server is running on ${PORT}.`);
});
