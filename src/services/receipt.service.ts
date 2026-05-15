import { pool } from "../configs/db";
import { ReceiptBody } from "../types/receipt";
import { v4 as uuidv4 } from "uuid";

export const createReceipt = async (body: ReceiptBody) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const receiptId = uuidv4();

    await client.query(
      `
      INSERT INTO warehouse_receipts (
        id,
        receipt_no,
        department,
        unit_name,
        delivery_person,
        import_reason,
        warehouse_name,
        document_count,
        total_amount
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        receiptId,
        body.receiptNo,
        body.department,
        body.unitName,
        body.deliveryPerson,
        body.importReason,
        body.warehouseName,
        body.documentCount,
        body.totalAmount,
      ]
    );

    for (const item of body.items) {
      await client.query(
        `
        INSERT INTO warehouse_receipt_items (
          id,
          receipt_id,
          product_name,
          product_code,
          unit,
          quantity,
          actual_quantity,
          unit_price,
          amount
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        `,
        [
          uuidv4(),
          receiptId,
          item.productName,
          item.productCode,
          item.unit,
          item.quantity,
          item.actualQuantity,
          item.unitPrice,
          item.amount,
        ]
      );
    }

    await client.query("COMMIT");

    return {
      message: "Create receipt successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
