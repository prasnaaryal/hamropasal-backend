import express from 'express';

// Import the relevant controllers
import {
  createProduct,
  getAllProducts,
  getProductsByQuery,
  deleteProduct,
  updateProduct,
  getProductsById,
} from '../../controllers/product/productController.mjs';
import { authenticateToken } from '../../middleware/index.js';
// Multer Configuration

const router = express.Router();
// Define the routes

router.post('/', authenticateToken,  createProduct);
router.get('/getallproducts', getAllProducts);
router.post('/search', getProductsByQuery);
router.get('/:productId', getProductsById);
router.delete('/:productId', authenticateToken, deleteProduct);
router.put('/:productId', authenticateToken,  updateProduct);

export default router;
