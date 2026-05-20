import { Request, Response } from "express";
import * as receiptService from "../services/receipt.service";
import { receiptCreateSchema, productCreateSchema } from "../validators/receipt.validator";

export const getReceipts = async (req: Request, res: Response) => {
  try {
    const receipts = await receiptService.getAllReceipts();
    res.status(200).json(receipts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReceiptDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID parameter" });
    }

    const receipt = await receiptService.getReceiptById(id);
    
    if (!receipt) return res.status(404).json({ message: "Receipt not found" });
    res.status(200).json(receipt);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const createReceiptController = async (req: Request, res: Response) => {
  try {
    const validatedData = receiptCreateSchema.parse(req.body);
    const result = await receiptService.createReceipt(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Error creating receipt:", error);
    res.status(400).json({ message: error.errors || error.message });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = productCreateSchema.parse(req.body);
    const product = await receiptService.createProduct(validatedData);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.errors || error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await receiptService.getAllProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
