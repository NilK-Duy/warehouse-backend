import { Router } from "express";
import {
  createReceiptController,
  getReceipts,
  getReceiptDetail,
  addProduct,
  getProducts,
} from "../controllers/receipt.controller";

const router = Router();

router.get("/", getReceipts);
router.get("/:id", getReceiptDetail);
router.post("/", createReceiptController);

router.get("/products/list", getProducts);
router.post("/products", addProduct);

export default router;
