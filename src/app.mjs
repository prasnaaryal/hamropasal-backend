import express, { json } from "express";
import helmet from "helmet";
import cors from "cors";
import rootRoutes from "./routes/index.js";

const app = express();

app.use(json());
app.use(cors());
app.use(helmet());
app.use("/api", rootRoutes);

export default app;
