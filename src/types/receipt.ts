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
  warehouseName: string;
  location?: string;
  attachedDocument?: string;
  items: ReceiptItemInput[];
}
