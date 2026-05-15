import request from "supertest";
import app from "../app";

describe("POST /api/receipts", () => {
  it("should create receipt successfully", async () => {
    const response = await request(app)
      .post("/api/receipts")
      .send({
        receiptNo: "PN001",
        department: "IT",
        unitName: "Warehouse A",
        deliveryPerson: "Ryan",
        importReason: "Import goods",
        warehouseName: "Main Warehouse",
        documentCount: 2,
        totalAmount: 1000,
        items: [
          {
            productName: "Laptop",
            productCode: "LP001",
            unit: "Piece",
            quantity: 1,
            actualQuantity: 1,
            unitPrice: 1000,
            amount: 1000,
          },
        ],
      });

    expect(response.status).toBe(201);
  });
});
