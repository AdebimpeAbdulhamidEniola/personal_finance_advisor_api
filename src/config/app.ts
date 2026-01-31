import cors from "cors";
import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import errorHandling from "@/middleware/errorHandler";
import { notFoundHandler } from "../general/notFoundHandler";




dotenv.config();

export const createApp = (): Application => {
  const app: Application = express();

  app.use(express.json())

  // Use Morgan logger in development only
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }


  app.use(cors());


   //Routes
   app.use('/api/auth', authRoutes);
   




  app.use(notFoundHandler);



  app.use(errorHandling)

  return app;
};
