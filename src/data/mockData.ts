export interface SKU {
  id: string;
  name: string;
  code: string;
  barcode: string;
  company: string;
  brand: string;
  mrp: number;
  rate: number;
  uom: string;
  unitsPerCase: number;
  gstPercent: number;
  stockCases: number;
  stockPcs: number;
  mustSell?: boolean;
}

export interface Outlet {
  id: string;
  name: string;
  ownerName: string;
  route: string;
  beatId: string;
  channel: 'General Trade' | 'Modern Trade' | 'HoReCa' | 'Wholesale';
  gstin?: string;
  phone: string;
  creditLimit: number;
  creditDays: number;
  currentBalance: number;
  overdueDays: number;
  status: 'active' | 'credit_hold' | 'inactive';
}

export interface OrderLine {
  skuId: string;
  skuName: string;
  qtyCases: number;
  qtyPcs: number;
  rate: number;
  schemeDesc?: string;
  schemeDiscount: number;
  amount: number;
  freeGoodsDesc?: string;
}

export interface SalesOrder {
  id: string;
  outletId: string;
  outletName: string;
  route: string;
  source: 'Salesman' | 'Retailer app' | 'Phone' | 'Chain PO · EDI';
  salesmanName?: string;
  date: string;
  deliveryDate: string;
  linesCount: number;
  totalValue: number;
  schemeTotal: number;
  status: 'Pending' | 'Billed' | 'Delivered' | 'Hold';
  checkStatus: 'OK' | 'Credit hold' | 'Short 3 SKUs' | 'PO match' | 'Price mismatch';
  lines: OrderLine[];
}

export interface VanSettlementItem {
  sku: string;
  loaded: number;
  sold: number;
  free: number;
  goodReturn: number;
  damageIn: number;
  expectedBack: number;
  countedBack: number;
  variance: number;
}

export interface VanTrip {
  id: string;
  vanNumber: string;
  driverSalesman: string;
  route: string;
  date: string;
  loadedAt: string;
  returnedAt: string;
  status: 'Active' | 'Settled' | 'Pending Review';
  items: VanSettlementItem[];
  cratesOut: number;
  cratesIn: number;
  cashSales: number;
  oldDuesCollected: number;
  upiReceived: number;
  chequesCount: number;
  chequesTotal: number;
  expenses: number;
  cashCounted: number;
  variance: number;
}

export interface ClaimRecord {
  id: string;
  company: string;
  type: string;
  period: string;
  amount: number;
  ageDays: number;
  status: 'Submitted' | 'Query raised' | 'Audit done' | 'Credit note recd.' | 'Overdue';
  evidence: {
    freeGoodsList: boolean;
    outletListGst: boolean;
    circularLinked: boolean;
    formatGenerated: boolean;
  };
  queryNote?: string;
}

export interface SalesmanScore {
  name: string;
  beat: string;
  visited: number;
  planned: number;
  productive: number;
  lpc: number;
  sales: number;
  mustSellCompleted: number;
  mustSellTotal: number;
}

// Initial Mock Data
export const COMPANIES = [
  { id: 'all', name: 'All companies' },
  { id: 'comp-a', name: 'Company A · Personal Care' },
  { id: 'comp-b', name: 'Company B · Foods' },
  { id: 'comp-c', name: 'Company C · Beverages' },
  { id: 'comp-d', name: 'Company D · Home Care' },
];

