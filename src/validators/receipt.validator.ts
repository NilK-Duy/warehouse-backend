import { z } from "zod";

export const receiptSchema = z.object({
  receiptNo: z.string(),
  department: z.string(),
  unitName: z.string(),
  deliveryPerson: z.string(),
  importReason: z.string(),
  warehouseName: z.string(),
  documentCount: z.number(),
  totalAmount: z.number(),
  items: z.array(
    z.object({
      productName: z.string(),
      productCode: z.string(),
      unit: z.string(),
      quantity: z.number(),
      actualQuantity: z.number(),
      unitPrice: z.number(),
      amount: z.number(),
    })
  ),
});
