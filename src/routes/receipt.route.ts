import { Router } from "express";
import { createReceiptController } from "../controllers/receipt.controller";

const router = Router();

router.post("/", createReceiptController);

export default router;
