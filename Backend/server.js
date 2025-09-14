import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import ChatRoutes from './routes/Chat.js'
import AuthRoutes from './routes/Auth.js'



const app=express();
const PORT=8080;
dotenv.config();



app.use(cors());
app.use(express.json());
app.use("/api",ChatRoutes);
app.use("/api",AuthRoutes);



//Database connection and server starting
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(" Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });


  } catch (err) {
    console.error(" Error connecting to DB:", err);
  }
};

connectDB();


