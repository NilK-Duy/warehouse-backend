import { Router } from "express";
import {
  addProduct,
  getProducts,
} from "../controllers/product.controller";

const router = Router();

router.get("/list", getProducts);
router.post("/", addProduct);

export default router;
