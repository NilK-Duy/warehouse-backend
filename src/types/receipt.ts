export interface ReceiptItemInput {
  productId: string;
  quantity: number;
  actualQuantity: number;
  unitPrice: number;
}

export interface ReceiptBody {
  receiptNo: string;
  department: string;
  unitName: string;
  deliveryPerson: string;
  importReason: string;
  warehouseName: string;
  location?: string;
  documentCount: number;
  items: ReceiptItemInput[];
}
