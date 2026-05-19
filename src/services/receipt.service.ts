import prisma from "../lib/prisma"
import { ReceiptBody } from "../types/receipt";

// 1. Get the list of receipts (with rough pagination included)
export const getAllReceipts = async () => {
  return await prisma.warehouseReceipt.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// 2. Get the details of the receipt (including the product information to be attached).
export const getReceiptById = async (id: string) => {
  return await prisma.warehouseReceipt.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

// 3. Create a new standard business receipt (using Transactions).
export const createReceipt = async (body: ReceiptBody) => {
  return await prisma.$transaction(async (tx) => { 
    let calculatedTotalAmount = 0;

    const itemsWithAmount = body.items.map((item) => {
      const amount = item.actualQuantity * item.unitPrice;
      calculatedTotalAmount += amount;

      return {
        productId: item.productId,
        quantity: item.quantity,
        actualQuantity: item.actualQuantity,
        unitPrice: item.unitPrice,
        amount: amount,
      };
    });

    const newReceipt = await tx.warehouseReceipt.create({
      data: {
        receiptNo: body.receiptNo,
        department: body.department,
        unitName: body.unitName,
        deliveryPerson: body.deliveryPerson,
        importReason: body.importReason,
        warehouseName: body.warehouseName,
        location: body.location || null,
        documentCount: body.documentCount,
        totalAmount: calculatedTotalAmount,
        items: {
          create: itemsWithAmount,
        },
      },
      include: {
        items: true,
      },
    });

    return newReceipt;
  });
};

// 4. Add a new product to the original catalog.
export const createProduct = async (data: { code: string; name: string; unit: string }) => {
  return await prisma.product.create({ data });
};

// 5. Get the list of products so the client can display the Select/Autocomplete box.
export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: { code: "asc" },
  });
};
