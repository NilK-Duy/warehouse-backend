import request from "supertest";
import express from "express";
import receiptRouter from "../routes/receipt.routes"
import * as receiptService from "../services/receipt.service";

jest.mock("../services/receipt.service");

const app = express();
app.use(express.json());
app.use("/api/receipts", receiptRouter);

describe("Receipt API Integration Tests", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TEST GET /api/receipts
  // ==========================================
  describe("GET /api/receipts", () => {
    it("nên trả về danh sách phiếu nhập kho thành công với status 200", async () => {
      const mockReceipts = [
        { id: "1", receiptNo: "PN001", totalAmount: 1000 },
        { id: "2", receiptNo: "PN002", totalAmount: 2000 }
      ];
      jest.mocked(receiptService.getAllReceipts).mockResolvedValue(mockReceipts as any);

      const response = await request(app).get("/api/receipts");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReceipts);
      expect(receiptService.getAllReceipts).toHaveBeenCalledTimes(1);
    });

    it("nên trả về status 500 nếu tầng service ném ra lỗi", async () => {
      (receiptService.getAllReceipts as jest.Mock).mockRejectedValue(new Error("Database connection error"));

      const response = await request(app).get("/api/receipts");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Database connection error");
    });
  });

  // ==========================================
  // TEST GET /api/receipts/:id
  // ==========================================
  describe("GET /api/receipts/:id", () => {
    it("nên trả về chi tiết phiếu nhập kho kèm sản phẩm khi tìm thấy ID", async () => {
      const mockReceiptDetail = {
        id: "rec-123",
        receiptNo: "PN001",
        items: [{ productId: "prod-1", quantity: 5, product: { name: "Laptop" } }]
      };
      jest.mocked(receiptService.getReceiptById).mockResolvedValue(mockReceiptDetail as any);

      const response = await request(app).get("/api/receipts/rec-123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReceiptDetail);
      expect(receiptService.getReceiptById).toHaveBeenCalledWith("rec-123");
    });

    it("nên trả về status 404 nếu không tồn tại phiếu có ID yêu cầu", async () => {
      jest.mocked(receiptService.getReceiptById).mockResolvedValue(null);

      const response = await request(app).get("/api/receipts/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Receipt not found");
    });
  });

  // ==========================================
  // TEST POST /api/receipts
  // ==========================================
  describe("POST /api/receipts", () => {
    it("nên tạo phiếu nhập kho thành công với dữ liệu đầu vào hợp lệ", async () => {
      // Dữ liệu đầu vào đúng chuẩn cấu trúc loại ReceiptBody trong types/receipt
      const validReceiptPayload = {
        receiptNo: "PN100",
        department: "IT",
        unitName: "Kho A",
        deliveryPerson: "Alex",
        warehouseName: "Main WH",
        attachedDocument: "12334",
        items: [
          {
            productId: "prod-abc", // Trường chuẩn bắt buộc thay cho productName cũ
            quantity: 2,
            actualQuantity: 2,
            unitPrice: 500
          }
        ]
      };

      const mockCreatedReceipt = { id: "new-receipt-id", ...validReceiptPayload, totalAmount: 1000 };
      jest.mocked(receiptService.createReceipt).mockResolvedValue(mockCreatedReceipt as any);

      const response = await request(app)
        .post("/api/receipts")
        .send(validReceiptPayload);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedReceipt);
    });

    it("nên trả về status 400 nếu dữ liệu đầu vào không vượt qua validator", async () => {
      // Gửi dữ liệu thiếu trường bắt buộc để kích hoạt lỗi Zod validation
      const invalidPayload = { receiptNo: "PN100" }; 

      const response = await request(app)
        .post("/api/receipts")
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  // ==========================================
  // TEST POST /api/receipts/products
  // ==========================================
  describe("POST /api/receipts/products", () => {
    it("nên thêm sản phẩm mới vào danh mục thành công", async () => {
      const validProductPayload = {
        code: "PROD001",
        name: "Chuột Không Dây",
        unit: "Cái"
      };
      jest.mocked(receiptService.createReceipt).mockResolvedValue({ id: "p-1", ...validProductPayload } as any);

      const response = await request(app)
        .post("/api/receipts/products")
        .send(validProductPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id", "p-1");
    });
  });

  // ==========================================
  // TEST GET /api/receipts/products/list
  // ==========================================
  describe("GET /api/receipts/products/list", () => {
    it("nên trả về danh mục toàn bộ sản phẩm thành công", async () => {
      const mockProducts = [
        { id: "p-1", code: "A", name: "Sản phẩm A", unit: "Cái" },
        { id: "p-2", code: "B", name: "Sản phẩm B", unit: "Hộp" }
      ];
      jest.mocked(receiptService.getAllProducts).mockResolvedValue(mockProducts as any);
      
      const response = await request(app).get("/api/receipts/products/list");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
  });
});
