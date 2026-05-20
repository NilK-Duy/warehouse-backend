import { z } from "zod";

export const productCreateSchema = z.object({
  code: z.string().min(1, "The product code must not be blank."),
  name: z.string().min(1, "The product name must not be blank."),
  unit: z.string().min(1, "The unit of measurement must not be blank."),
});

export const receiptCreateSchema = z.object({
  receiptNo: z.string().min(1, "The ballot must not be blank."),
  department: z.string().min(1),
  unitName: z.string().min(1),
  deliveryPerson: z.string().min(1),
  warehouseName: z.string().min(1),
  location: z.string().optional(),
  attachedDocument: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().uuid("productId must be a valid UUID string"),
      quantity: z.number().positive(),
      actualQuantity: z.number().positive(),
      unitPrice: z.number().nonnegative(),
    })
  ).min(1, "The receipt must contain at least 1 product."),
});
