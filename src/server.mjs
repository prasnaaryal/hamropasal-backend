import app from "./app.mjs";
import connectDb from "./database/connection.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";

dotenv.config();
const port = process.env.PORT || 9000;

const startServer = () => {
  try {
    connectDb(process.env.MONGODB_URL);
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

startServer();