import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { productCreateSchema } from "../validators/receipt.validator";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = productCreateSchema.parse(req.body);
    const product = await productService.createProduct(validatedData);
    res.status(201).json(product);
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: "Error creating product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};
