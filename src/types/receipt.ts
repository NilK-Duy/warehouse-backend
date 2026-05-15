export interface ReceiptItem {
  productName: string;
  productCode: string;
  unit: string;
  quantity: number;
  actualQuantity: number;
  unitPrice: number;
  amount: number;
}

export interface ReceiptBody {
  receiptNo: string;
  department: string;
  unitName: string;
  deliveryPerson: string;
  importReason: string;
  warehouseName: string;
  documentCount: number;
  totalAmount: number;
  items: ReceiptItem[];
}
