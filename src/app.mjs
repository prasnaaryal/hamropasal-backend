import express, { json } from "express";

import helmet from "helmet";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDb from "./database/connection.js";
import rootRoutes from "./routes/index.js";

dotenv.config();

// Importing the routes

const app = express();
const port = process.env.PORT || 9000;

app.use(json());
app.use(cors());
app.use(helmet());


app.use("/api", rootRoutes);


const startServer = () => {
    try {
      connectDb(process.env.MONGODB_URL);
      app.listen(port, () => {
        console.log(`Server running on ${port}`);
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  startServer();
