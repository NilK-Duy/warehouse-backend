import { Request, Response } from "express";
import { receiptSchema } from "../validators/receipt.validator";
import { createReceipt } from "../services/receipt.service";

export const createReceiptController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = receiptSchema.parse(req.body);

    const result = await createReceipt(validatedData);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
