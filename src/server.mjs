import app from "./app.mjs";
import connectDb from "./database/connection.js";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 9000;

const startServer = () => {
  try {
    connectDb(process.env.MONGODB_URL);
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
