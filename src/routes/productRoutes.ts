import express from 'express';
import { getProductData } from '../controllers/productController';

const router = express.Router();

router.get('/producto/:codart', getProductData);

export default router;
