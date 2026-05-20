import { Router } from "express";
import {
  createReceiptController,
  getReceipts,
  getReceiptDetail,
} from "../controllers/receipt.controller";

const router = Router();

router.get("/", getReceipts);
router.get("/:id", getReceiptDetail);
router.post("/", createReceiptController);

export default router;
