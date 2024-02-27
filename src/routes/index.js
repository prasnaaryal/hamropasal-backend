import express from "express";

// Import the routes from other files
import authRoutes from "./auth/authRoutes.js";
import userRoutes from "./user/userRoutes.js"
import productRoutes from "./product/productRoutes.js"
import categoryRoutes from "./category/categoryRoutes.js" // Use the imported routes const router = express.Router();
import orderRoutes from "./order/orderRoutes.js"

const router = express.Router();

router.use("/auth", authRoutes); // localhost:9000/api/auth/register or localhost:9000/api/auth/login
router.use("/user", userRoutes); // localhost:9000/api/user/load-user
router.use("/product", productRoutes); // localhost:9000/api/product
router.use("/category", categoryRoutes); // localhost:9000/api/category
router.use("/order", orderRoutes); // localhost:9000/api/order

export default router;
