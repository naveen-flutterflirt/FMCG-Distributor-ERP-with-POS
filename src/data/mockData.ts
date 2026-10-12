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

export const MOCK_SKUS: SKU[] = [
  { id: 'sku-1', name: 'Tea 250 g', code: 'TEA-250', barcode: '890103001', company: 'Company A', brand: 'Taj Red', mrp: 130, rate: 108.00, uom: 'Case (24)', unitsPerCase: 24, gstPercent: 5, stockCases: 145, stockPcs: 12, mustSell: true },
  { id: 'sku-2', name: 'Biscuit ₹10 pack', code: 'BIS-10', barcode: '890103002', company: 'Company B', brand: 'Gold Crunch', mrp: 10, rate: 8.40, uom: 'Case (60)', unitsPerCase: 60, gstPercent: 18, stockCases: 420, stockPcs: 45, mustSell: false },
  { id: 'sku-3', name: 'Detergent 1 kg', code: 'DET-1K', barcode: '890103003', company: 'Company D', brand: 'CleanMax', mrp: 110, rate: 96.50, uom: 'Piece', unitsPerCase: 12, gstPercent: 18, stockCases: 85, stockPcs: 8, mustSell: false },
  { id: 'sku-4', name: 'Soap 4-pack', code: 'SOP-4P', barcode: '890103004', company: 'Company A', brand: 'SilkCare', mrp: 140, rate: 118.00, uom: 'Piece', unitsPerCase: 24, gstPercent: 18, stockCases: 110, stockPcs: 14, mustSell: true },
  { id: 'sku-5', name: 'Cooking oil 1 L pouch', code: 'OIL-1L', barcode: '890103005', company: 'Company B', brand: 'PureGold', mrp: 165, rate: 142.00, uom: 'Piece', unitsPerCase: 15, gstPercent: 5, stockCases: 210, stockPcs: 5, mustSell: false },
  { id: 'sku-6', name: 'Atta 5 kg', code: 'ATT-5K', barcode: '890103006', company: 'Company B', brand: 'ShreeFarm', mrp: 265, rate: 228.00, uom: 'Piece', unitsPerCase: 6, gstPercent: 0, stockCases: 95, stockPcs: 3, mustSell: false },
  { id: 'sku-7', name: 'Soft drink 600 ml', code: 'SFT-600', barcode: '890103007', company: 'Company C', brand: 'CoolWave', mrp: 40, rate: 32.50, uom: 'Case (24)', unitsPerCase: 24, gstPercent: 28, stockCases: 160, stockPcs: 18, mustSell: true },
  { id: 'sku-8', name: 'Chips ₹10 pack', code: 'CHP-10', barcode: '890103008', company: 'Company B', brand: 'Crunchitos', mrp: 10, rate: 8.20, uom: 'Case (40)', unitsPerCase: 40, gstPercent: 12, stockCases: 350, stockPcs: 22, mustSell: false },
  { id: 'sku-9', name: 'Noodles 4-pack', code: 'NOD-4P', barcode: '890103009', company: 'Company B', brand: 'QuickBowl', mrp: 55, rate: 46.00, uom: 'Piece', unitsPerCase: 24, gstPercent: 12, stockCases: 70, stockPcs: 10, mustSell: true },
  { id: 'sku-10', name: 'Floor cleaner 500 ml', code: 'FLR-500', barcode: '890103010', company: 'Company D', brand: 'BrightShine', mrp: 95, rate: 78.00, uom: 'Piece', unitsPerCase: 12, gstPercent: 18, stockCases: 45, stockPcs: 6, mustSell: true },
];

export const MOCK_OUTLETS: Outlet[] = [
  { id: 'out-1', name: 'Gupta Kirana Store', ownerName: 'Rajesh Gupta', route: 'R4 Gandhi Nagar', beatId: 'B-GN', channel: 'General Trade', gstin: '07AAAAA1234A1Z5', phone: '9811223344', creditLimit: 25000, creditDays: 14, currentBalance: 4200, overdueDays: 0, status: 'active' },
  { id: 'out-2', name: 'Shree Ram General', ownerName: 'Ramesh Sharma', route: 'R4 Gandhi Nagar', beatId: 'B-GN', channel: 'General Trade', gstin: '07AABCS2345B1Z9', phone: '9822334455', creditLimit: 30000, creditDays: 14, currentBalance: 8450, overdueDays: 0, status: 'active' },
  { id: 'out-3', name: 'New Bharat Stores', ownerName: 'Anand Kumar', route: 'R2 Station Rd', beatId: 'B-SR', channel: 'General Trade', phone: '9833445566', creditLimit: 15000, creditDays: 7, currentBalance: 16800, overdueDays: 24, status: 'credit_hold' },
  { id: 'out-4', name: 'Hotel Sagar (HoReCa)', ownerName: 'Suresh Shetty', route: 'R1 Civil Lines', beatId: 'B-CL', channel: 'HoReCa', gstin: '07AAGHS9876C1Z2', phone: '9844556677', creditLimit: 50000, creditDays: 21, currentBalance: 14200, overdueDays: 0, status: 'active' },
  { id: 'out-5', name: 'Ma Durga Traders (wholesale)', ownerName: 'Vinod Mittal', route: 'R3 Old Market', beatId: 'B-OM', channel: 'Wholesale', gstin: '07AAECM4567D1Z8', phone: '9855667788', creditLimit: 200000, creditDays: 15, currentBalance: 78500, overdueDays: 4, status: 'active' },
  { id: 'out-6', name: 'SuperMart #17 (modern trade)', ownerName: 'Retail Corp India', route: 'MT route', beatId: 'B-MT', channel: 'Modern Trade', gstin: '07AACCR1122F1Z4', phone: '9866778899', creditLimit: 500000, creditDays: 45, currentBalance: 236400, overdueDays: 0, status: 'active' },
  { id: 'out-7', name: 'Sharma Pan Bhandar', ownerName: 'Dinesh Sharma', route: 'R6 Industrial Area', beatId: 'B-IA', channel: 'General Trade', phone: '9877889900', creditLimit: 5000, creditDays: 0, currentBalance: 0, overdueDays: 0, status: 'active' },
];

export const MOCK_ORDERS: SalesOrder[] = [
  {
    id: 'SO-61208',
    outletId: 'out-1',
    outletName: 'Gupta Kirana Store',
    route: 'R4 Gandhi Nagar',
    source: 'Salesman',
    salesmanName: 'Rakesh',
    date: 'Fri, 9 Oct',
    deliveryDate: 'Sat 10 Oct',
    linesCount: 9,
    totalValue: 6871,
    schemeTotal: 420,
    status: 'Pending',
    checkStatus: 'OK',
    lines: [
      { skuId: 'sku-1', skuName: 'Tea 250 g', qtyCases: 2, qtyPcs: 0, rate: 108.00, schemeDesc: 'QPS 2%', schemeDiscount: 103.68, amount: 5080 },
      { skuId: 'sku-2', skuName: 'Biscuit ₹10 pack', qtyCases: 1, qtyPcs: 0, rate: 8.40, schemeDesc: '12+1', schemeDiscount: 42.00, amount: 504, freeGoodsDesc: '5 pcs free' },
      { skuId: 'sku-3', skuName: 'Detergent 1 kg', qtyCases: 0, qtyPcs: 6, rate: 96.50, schemeDiscount: 0, amount: 579 },
      { skuId: 'sku-4', skuName: 'Soap 4-pack', qtyCases: 0, qtyPcs: 6, rate: 118.00, schemeDesc: 'Free 75 g', schemeDiscount: 0, amount: 708, freeGoodsDesc: 'Free 75 g soap' },
    ]
  },
  {
    id: 'SO-61211',
    outletId: 'out-2',
    outletName: 'Shree Ram General',
    route: 'R4 Gandhi Nagar',
    source: 'Retailer app',
    date: 'Fri, 9 Oct',
    deliveryDate: 'Sat 10 Oct',
    linesCount: 14,
    totalValue: 11920,
    schemeTotal: 960,
    status: 'Pending',
    checkStatus: 'OK',
    lines: [
      { skuId: 'sku-1', skuName: 'Tea 250 g', qtyCases: 4, qtyPcs: 0, rate: 108.00, schemeDesc: 'QPS 2%', schemeDiscount: 207.36, amount: 10160 },
      { skuId: 'sku-2', skuName: 'Biscuit ₹10 pack', qtyCases: 3, qtyPcs: 0, rate: 8.40, schemeDesc: '12+1', schemeDiscount: 126.00, amount: 1512, freeGoodsDesc: '15 pcs free' },
      { skuId: 'sku-10', skuName: 'Floor cleaner 500 ml', qtyCases: 0, qtyPcs: 4, rate: 78.00, schemeDiscount: 0, amount: 312 },
    ]
  },
  {
    id: 'SO-61215',
    outletId: 'out-3',
    outletName: 'New Bharat Stores',
    route: 'R2 Station Rd',
    source: 'Salesman',
    salesmanName: 'Anil',
    date: 'Fri, 9 Oct',
    deliveryDate: 'Sat 10 Oct',
    linesCount: 7,
    totalValue: 5310,
    schemeTotal: 180,
    status: 'Hold',
    checkStatus: 'Credit hold',
    lines: [
      { skuId: 'sku-3', skuName: 'Detergent 1 kg', qtyCases: 2, qtyPcs: 0, rate: 96.50, schemeDiscount: 0, amount: 2316 },
      { skuId: 'sku-5', skuName: 'Cooking oil 1 L pouch', qtyCases: 1, qtyPcs: 0, rate: 142.00, schemeDiscount: 0, amount: 2130 },
      { skuId: 'sku-9', skuName: 'Noodles 4-pack', qtyCases: 0, qtyPcs: 18, rate: 46.00, schemeDiscount: 0, amount: 828 },
    ]
  },
  {
    id: 'SO-61219',
    outletId: 'out-4',
    outletName: 'Hotel Sagar (HoReCa)',
    route: 'R1 Civil Lines',
    source: 'Phone',
    date: 'Fri, 9 Oct',
    deliveryDate: 'Sat 10 Oct',
    linesCount: 6,
    totalValue: 14200,
    schemeTotal: 0,
    status: 'Pending',
    checkStatus: 'OK',
    lines: [
      { skuId: 'sku-5', skuName: 'Cooking oil 1 L pouch', qtyCases: 5, qtyPcs: 0, rate: 142.00, schemeDiscount: 0, amount: 10650 },
      { skuId: 'sku-6', skuName: 'Atta 5 kg', qtyCases: 2, qtyPcs: 0, rate: 228.00, schemeDiscount: 0, amount: 2736 },
      { skuId: 'sku-1', skuName: 'Tea 250 g', qtyCases: 0, qtyPcs: 8, rate: 108.00, schemeDiscount: 0, amount: 864 },
    ]
  },
  {
    id: 'SO-61224',
    outletId: 'out-5',
    outletName: 'Ma Durga Traders (wholesale)',
    route: 'R3 Old Market',
    source: 'Salesman',
    salesmanName: 'Farhan',
    date: 'Fri, 9 Oct',
    deliveryDate: 'Sat 10 Oct',
    linesCount: 22,
    totalValue: 84600,
    schemeTotal: 5120,
    status: 'Pending',
    checkStatus: 'Short 3 SKUs',
    lines: [
      { skuId: 'sku-1', skuName: 'Tea 250 g', qtyCases: 15, qtyPcs: 0, rate: 108.00, schemeDesc: 'Wholesale slab', schemeDiscount: 1800, amount: 37080 },
      { skuId: 'sku-2', skuName: 'Biscuit ₹10 pack', qtyCases: 20, qtyPcs: 0, rate: 8.40, schemeDesc: 'QPS 5%', schemeDiscount: 1008, amount: 19152 },
      { skuId: 'sku-7', skuName: 'Soft drink 600 ml', qtyCases: 10, qtyPcs: 0, rate: 32.50, schemeDiscount: 0, amount: 7800 },
    ]
  },
  {
    id: 'MT-0412',
    outletId: 'out-6',
    outletName: 'SuperMart #17 (modern trade)',
    route: 'MT route',
    source: 'Chain PO · EDI',
    date: 'Fri, 9 Oct',
    deliveryDate: 'Sat 10 Oct',
    linesCount: 48,
    totalValue: 236400,
    schemeTotal: 0,
    status: 'Pending',
    checkStatus: 'PO match',
    lines: [
      { skuId: 'sku-1', skuName: 'Tea 250 g', qtyCases: 30, qtyPcs: 0, rate: 104.00, schemeDesc: 'Margin terms', schemeDiscount: 0, amount: 74880 },
      { skuId: 'sku-3', skuName: 'Detergent 1 kg', qtyCases: 40, qtyPcs: 0, rate: 94.00, schemeDesc: 'Margin terms', schemeDiscount: 0, amount: 45120 },
      { skuId: 'sku-5', skuName: 'Cooking oil 1 L pouch', qtyCases: 50, qtyPcs: 0, rate: 139.00, schemeDesc: 'Margin terms', schemeDiscount: 0, amount: 104250 },
    ]
  }
];

export const MOCK_VAN_TRIP: VanTrip = {
  id: 'van-2',
  vanNumber: 'Van 2 · DL 1L AB 4022',
  driverSalesman: 'Imran Khan',
  route: 'Route R6 Industrial Area',
  date: 'Fri 9 Oct',
  loadedAt: '08:10',
  returnedAt: '19:25',
  status: 'Pending Review',
  cratesOut: 10,
  cratesIn: 8,
  cashSales: 58420,
  oldDuesCollected: 12830,
  upiReceived: 31600,
  chequesCount: 3,
  chequesTotal: 14250,
  expenses: 1140,
  cashCounted: 68870,
  variance: -1240,
  items: [
    { sku: 'Tea 250 g', loaded: 120, sold: 86, free: 0, goodReturn: 2, damageIn: 0, expectedBack: 36, countedBack: 36, variance: 0 },
    { sku: 'Biscuit ₹10 pack', loaded: 600, sold: 492, free: 38, goodReturn: 0, damageIn: 4, expectedBack: 74, countedBack: 74, variance: 0 },
    { sku: 'Soft drink 600 ml', loaded: 240, sold: 198, free: 0, goodReturn: 0, damageIn: 3, expectedBack: 45, countedBack: 44, variance: -1 },
    { sku: 'Detergent 1 kg', loaded: 60, sold: 41, free: 0, goodReturn: 1, damageIn: 0, expectedBack: 20, countedBack: 20, variance: 0 },
  ]
};

export const MOCK_CLAIMS: ClaimRecord[] = [
  { id: 'CL-26-088', company: 'Company A', type: 'Trade scheme (QPS)', period: 'Sep 2026', amount: 482300, ageDays: 8, status: 'Submitted', evidence: { freeGoodsList: true, outletListGst: true, circularLinked: true, formatGenerated: true } },
  { id: 'CL-26-086', company: 'Company B', type: 'Free goods (12+1)', period: 'Sep 2026', amount: 214600, ageDays: 9, status: 'Query raised', evidence: { freeGoodsList: true, outletListGst: true, circularLinked: true, formatGenerated: true }, queryNote: '3 invoices outside period' },
  { id: 'CL-26-081', company: 'Company C', type: 'Damage / expiry', period: 'Aug 2026', amount: 136900, ageDays: 34, status: 'Audit done', evidence: { freeGoodsList: false, outletListGst: true, circularLinked: true, formatGenerated: true } },
  { id: 'CL-26-074', company: 'Company A', type: 'Display / visibility', period: 'Aug 2026', amount: 68000, ageDays: 39, status: 'Credit note recd.', evidence: { freeGoodsList: false, outletListGst: true, circularLinked: true, formatGenerated: true } },
  { id: 'CL-26-061', company: 'Company D', type: 'Price drop (stock on hand)', period: 'Jul 2026', amount: 92400, ageDays: 71, status: 'Overdue', evidence: { freeGoodsList: false, outletListGst: true, circularLinked: false, formatGenerated: true } },
  { id: 'CL-26-058', company: 'Company B', type: 'Transport subsidy', period: 'Jul 2026', amount: 41200, ageDays: 74, status: 'Overdue', evidence: { freeGoodsList: false, outletListGst: true, circularLinked: false, formatGenerated: true } },
];

export const MOCK_SALESMEN: SalesmanScore[] = [
  { name: 'Rakesh', beat: 'Gandhi Nagar', visited: 28, planned: 32, productive: 22, lpc: 7.1, sales: 48600, mustSellCompleted: 5, mustSellTotal: 5 },
  { name: 'Anil', beat: 'Station Road', visited: 31, planned: 35, productive: 19, lpc: 5.2, sales: 36900, mustSellCompleted: 3, mustSellTotal: 5 },
  { name: 'Farhan', beat: 'Old Market', visited: 18, planned: 30, productive: 11, lpc: 4.6, sales: 21400, mustSellCompleted: 2, mustSellTotal: 5 },
  { name: 'Manoj', beat: 'Civil Lines', visited: 26, planned: 28, productive: 21, lpc: 6.8, sales: 44100, mustSellCompleted: 5, mustSellTotal: 5 },
];
