// ─── VEHICLES ───────────────────────────────────────────────────────────────
export const vehicles = [
  { id: 1, make: "Toyota",   model: "Camry XSE V6",       year: 2024, type: "New",      category: "Sedan",  price: 34400, marketPrice: 31200, mileage: 0,      color: "Midnight Black",  status: "Available",         margin: 8.3, daysOnLot: 12, vin: "JT2BF22K9W0120841", image: "🚗" },
  { id: 2, make: "Ford",     model: "Explorer ST 4WD",    year: 2024, type: "New",      category: "SUV",    price: 51900, marketPrice: 47800, mileage: 0,      color: "Rapid Red",       status: "Deal in Progress",  margin: 7.9, daysOnLot: 5,  vin: "1FMHK7F85EGA29834", image: "🚙" },
  { id: 3, make: "BMW",      model: "530i xDrive",        year: 2023, type: "Used CPO", category: "Sedan",  price: 63200, marketPrice: 58900, mileage: 22000,  color: "Alpine White",    status: "Deal in Progress",  margin: 6.8, daysOnLot: 28, vin: "WBA53BJ0XMW438291", image: "🏎️" },
  { id: 4, make: "Honda",    model: "CR-V Hybrid EX-L",   year: 2024, type: "New",      category: "SUV",    price: 41750, marketPrice: 38400, mileage: 0,      color: "Sonic Gray",      status: "On Hold",           margin: 8.0, daysOnLot: 3,  vin: "7FARW2H84NE025931", image: "🚐" },
  { id: 5, make: "Tesla",    model: "Model 3 Long Range",  year: 2023, type: "Used CPO", category: "EV",     price: 38900, marketPrice: 36200, mileage: 18500,  color: "Pearl White",     status: "Reconditioning",    margin: 5.2, daysOnLot: 44, vin: "5YJ3E1EA9NF123456", image: "🚗" },
  { id: 6, make: "Hyundai",  model: "Tucson N-Line",      year: 2024, type: "New",      category: "SUV",    price: 34200, marketPrice: 31800, mileage: 0,      color: "Shimmering Silver",status: "Available",         margin: 7.0, daysOnLot: 9,  vin: "5NMJBCDE1NH009173", image: "🚙" },
  { id: 7, make: "Kia",      model: "Seltos HTX AWD",     year: 2024, type: "New",      category: "SUV",    price: 31500, marketPrice: 29200, mileage: 0,      color: "Glacier White",   status: "Available",         margin: 7.3, daysOnLot: 6,  vin: "KNDPE3AF9P7123456", image: "🚗" },
  { id: 8, make: "Maruti",   model: "Brezza ZXI+",        year: 2022, type: "Used CPO", category: "SUV",    price: 14800, marketPrice: 13500, mileage: 31000,  color: "Brave Khaki",     status: "Available",         margin: 6.1, daysOnLot: 18, vin: "MA3EWDE1S00274859", image: "🚙" },
  { id: 9, make: "MG",       model: "ZS EV Exclusive",    year: 2023, type: "Used CPO", category: "EV",     price: 24900, marketPrice: 22800, mileage: 14200,  color: "Aurora Silver",   status: "In-Transit",        margin: 6.4, daysOnLot: 0,  vin: "SADKA2BN5HA123456", image: "🚗" },
  { id:10, make: "Tata",     model: "Nexon EV MAX",       year: 2024, type: "New",      category: "EV",     price: 19800, marketPrice: 18400, mileage: 0,      color: "Daytona Grey",    status: "Available",         margin: 7.7, daysOnLot: 2,  vin: "MAT600474NWA12345", image: "🚗" },
];

// ─── LEADS ──────────────────────────────────────────────────────────────────
export const leads = [
  { id: 1,  name: "Arjun Mehta",    phone: "+91 98765 43210", email: "arjun@gmail.com",   interest: "2024 Toyota Camry",     source: "Web",       status: "Hot Lead",       assignedTo: "Kiran S.",  lastContact: "2h ago",   budget: "$34,000", notes: "Wants test drive this weekend" },
  { id: 2,  name: "Priya Sharma",   phone: "+91 87654 32109", email: "priya@gmail.com",   interest: "2024 Ford Explorer",    source: "Autotrader",status: "Qualified",      assignedTo: "Raj P.",    lastContact: "30m ago",  budget: "$52,000", notes: "Comparing with BMW X3" },
  { id: 3,  name: "Vikram Singh",   phone: "+91 76543 21098", email: "vikram@gmail.com",  interest: "2024 Hyundai Tucson",   source: "Walk-in",   status: "New",            assignedTo: "Anita R.",  lastContact: "1d ago",   budget: "$35,000", notes: "First visit, needs brochure" },
  { id: 4,  name: "Sneha Patel",    phone: "+91 65432 10987", email: "sneha@gmail.com",   interest: "2024 Honda CR-V",       source: "Web",       status: "Follow-up Due",  assignedTo: "Deepak M.", lastContact: "3h ago",   budget: "$42,000", notes: "Interested in hybrid variant" },
  { id: 5,  name: "Rahul Verma",    phone: "+91 54321 09876", email: "rahul@gmail.com",   interest: "2023 BMW 5 Series",     source: "Phone",     status: "Negotiating",    assignedTo: "Kiran S.",  lastContact: "1h ago",   budget: "$65,000", notes: "Wants extended warranty" },
  { id: 6,  name: "Meena Iyer",     phone: "+91 43210 98765", email: "meena@gmail.com",   interest: "2024 Tata Nexon EV",    source: "Web",       status: "New",            assignedTo: "Raj P.",    lastContact: "5h ago",   budget: "$20,000", notes: "Asking about EV subsidies" },
  { id: 7,  name: "Suresh Kumar",   phone: "+91 32109 87654", email: "suresh@gmail.com",  interest: "2023 Tesla Model 3",    source: "Autotrader",status: "Contacted",      assignedTo: "Anita R.",  lastContact: "2d ago",   budget: "$40,000", notes: "Trade-in available (Swift 2019)" },
  { id: 8,  name: "Kavya Nair",     phone: "+91 21098 76543", email: "kavya@gmail.com",   interest: "2024 Kia Seltos",       source: "Walk-in",   status: "Closed Won",     assignedTo: "Deepak M.", lastContact: "Today",    budget: "$32,000", notes: "Deal finalized – delivery Saturday" },
];

// ─── DEALS ──────────────────────────────────────────────────────────────────
export const deals = [
  { id: 1, customer: "Arjun Mehta",  vehicle: "2024 Toyota Camry XSE",   type: "Purchase", salePrice: 34400, tradeIn: 0,      downPayment: 5000,  financeAmount: 29400, monthlyPayment: 584,  term: 60, rate: 6.9, status: "Desking",     stage: 30 },
  { id: 2, customer: "Priya Sharma", vehicle: "2024 Ford Explorer ST",    type: "Lease",    salePrice: 51900, tradeIn: 12000,  downPayment: 3000,  financeAmount: 36900, monthlyPayment: 694,  term: 36, rate: 5.9, status: "F&I Review",   stage: 60 },
  { id: 3, customer: "Rahul Verma",  vehicle: "2023 BMW 530i xDrive",     type: "Purchase", salePrice: 63200, tradeIn: 0,      downPayment: 15000, financeAmount: 48200, monthlyPayment: 948,  term: 60, rate: 5.4, status: "E-Sign",       stage: 85 },
  { id: 4, customer: "Sneha Patel",  vehicle: "2024 Honda CR-V Hybrid",   type: "Purchase", salePrice: 41750, tradeIn: 8500,   downPayment: 4000,  financeAmount: 29250, monthlyPayment: 576,  term: 60, rate: 7.2, status: "Credit Pending",stage: 45 },
  { id: 5, customer: "Kavya Nair",   vehicle: "2024 Kia Seltos HTX",      type: "Purchase", salePrice: 31500, tradeIn: 5000,   downPayment: 6500,  financeAmount: 20000, monthlyPayment: 390,  term: 60, rate: 6.5, status: "Delivered",    stage: 100 },
];

// ─── SERVICE BOOKINGS ────────────────────────────────────────────────────────
export const serviceBookings = [
  { id: 1, customer: "Kumar Rajan",   vehicle: "Toyota Fortuner",   regNo: "TN09 XX 1234", service: "Oil Change + Health Check",  advisor: "Pradeep V.", tech: "Suresh K.", time: "08:00", eta: "09:30", bay: 1, status: "In Progress",  cost: 3200 },
  { id: 2, customer: "Anjali Das",    vehicle: "Honda City",         regNo: "AP10 YY 5678", service: "Brake Inspection + Tyre Rotation", advisor: "Meena L.", tech: "Ramesh P.", time: "09:30", eta: "11:00", bay: 2, status: "In Progress",  cost: 2800 },
  { id: 3, customer: "Sanjay Nair",   vehicle: "Hyundai Creta",      regNo: "TS07 ZZ 9012", service: "Digital Vehicle Health Check", advisor: "Pradeep V.", tech: "Anand S.", time: "11:00", eta: "12:30", bay: 3, status: "Inspection",   cost: 1500 },
  { id: 4, customer: "Meena Pillai",  vehicle: "Kia Seltos",         regNo: "KA01 AA 3456", service: "AC Service + Warranty Recall", advisor: "Meena L.", tech: "Vijay M.",  time: "13:30", eta: "16:00", bay: 5, status: "Parts Waiting", cost: 5400 },
  { id: 5, customer: "Arun Krishnan", vehicle: "Tata Nexon EV",      regNo: "MH02 BB 7890", service: "Software Update + Check",    advisor: "Pradeep V.", tech: "Karthik R.",time: "14:00", eta: "15:30", bay: 4, status: "Scheduled",    cost: 800  },
  { id: 6, customer: "Divya Rao",     vehicle: "Maruti Brezza",      regNo: "TG10 CC 2345", service: "Periodic Maintenance 30K",   advisor: "Meena L.", tech: "Suresh K.", time: "15:00", eta: "17:30", bay: 6, status: "Scheduled",    cost: 4200 },
];

// ─── PARTS ───────────────────────────────────────────────────────────────────
export const parts = [
  { id: 1, name: "Engine Air Filter",       sku: "TOY-EAF-2024",  make: "Toyota (all)",         stock: 3,   reorderAt: 10, unitCost: 18,  autoOrder: true,  status: "Critical Low" },
  { id: 2, name: "Brake Pads Set – Front",  sku: "HON-BPS-FRR",   make: "Honda CR-V / City",    stock: 8,   reorderAt: 12, unitCost: 64,  autoOrder: true,  status: "Low Stock"    },
  { id: 3, name: "Cabin Air Filter",        sku: "HYU-CF-IX25",   make: "Hyundai Creta/i20",    stock: 2,   reorderAt: 8,  unitCost: 22,  autoOrder: true,  status: "Critical Low" },
  { id: 4, name: "Engine Oil 5W-30 (5L)",   sku: "OIL-5W30-5L",   make: "Universal",            stock: 42,  reorderAt: 20, unitCost: 38,  autoOrder: true,  status: "In Stock"     },
  { id: 5, name: "Spark Plugs – Iridium",   sku: "FRD-SP-2.0T",   make: "Ford EcoBoost",        stock: 1,   reorderAt: 6,  unitCost: 12,  autoOrder: false, status: "Critical Low" },
  { id: 6, name: "Windshield Wipers Pair",  sku: "UNI-WW-2426",   make: "Universal",            stock: 24,  reorderAt: 10, unitCost: 28,  autoOrder: true,  status: "In Stock"     },
  { id: 7, name: "Battery 12V 65Ah",        sku: "BAT-12V-65AH",  make: "Universal",            stock: 7,   reorderAt: 5,  unitCost: 180, autoOrder: false, status: "In Stock"     },
  { id: 8, name: "AC Refrigerant R134a",    sku: "AC-R134A-1KG",  make: "Universal",            stock: 5,   reorderAt: 8,  unitCost: 45,  autoOrder: true,  status: "Low Stock"    },
];

// ─── F&I APPLICATIONS ────────────────────────────────────────────────────────
export const fiApplications = [
  { id: 1, customer: "Arjun Mehta",  vehicle: "2024 Toyota Camry XSE",  lender: "HDFC Bank",     financeAmt: 28600, rate: 7.2, term: 60, status: "Approved",    products: ["Extended Warranty","GAP Insurance"],          signStatus: "Pending",   pvr: 1840 },
  { id: 2, customer: "Priya Sharma", vehicle: "2024 Ford Explorer ST",   lender: "ICICI Bank",    financeAmt: 36900, rate: 6.9, term: 36, status: "Conditional", products: ["Paint Protection","Tyre & Rim"],               signStatus: "Not Sent",  pvr: 2100 },
  { id: 3, customer: "Rahul Verma",  vehicle: "2023 BMW 530i xDrive",    lender: "BMW Financial", financeAmt: 49200, rate: 5.9, term: 60, status: "Approved",    products: ["Extended Warranty","Service Plan","GAP Insurance"], signStatus: "Sent",  pvr: 3200 },
  { id: 4, customer: "Sneha Patel",  vehicle: "2024 Honda CR-V Hybrid",  lender: "SBI Motors",    financeAmt: 32750, rate: 8.1, term: 60, status: "Pending",     products: [],                                             signStatus: "Not Sent",  pvr: 0    },
  { id: 5, customer: "Kavya Nair",   vehicle: "2024 Kia Seltos HTX",     lender: "Axis Bank",     financeAmt: 20000, rate: 7.5, term: 48, status: "Approved",    products: ["Extended Warranty"],                          signStatus: "Signed",    pvr: 950  },
];

// ─── APPRAISALS ──────────────────────────────────────────────────────────────
export const appraisals = [
  { id: 1, customer: "Suresh Kumar",  make: "Maruti", model: "Swift ZXI",     year: 2019, mileage: 42000, color: "White",        kbbValue: 480000,  bbValue: 510000,  offerMade: 495000, reconCost: 18000, status: "Offer Made",    condition: "Good"      },
  { id: 2, customer: "Vikram Singh",  make: "Hyundai",model: "Verna SX",      year: 2020, mileage: 31000, color: "Polar White",  kbbValue: 620000,  bbValue: 640000,  offerMade: 630000, reconCost: 12000, status: "Accepted",      condition: "Excellent" },
  { id: 3, customer: "Meena Iyer",    make: "Honda",  model: "City ZX CVT",   year: 2021, mileage: 24000, color: "Radiant Red",  kbbValue: 780000,  bbValue: 800000,  offerMade: 0,      reconCost: 22000, status: "Inspecting",    condition: "Good"      },
  { id: 4, customer: "Priya Sharma",  make: "Toyota", model: "Fortuner 4WD",  year: 2019, mileage: 58000, color: "Super White",  kbbValue: 1850000, bbValue: 1920000, offerMade: 1880000,reconCost: 45000, status: "Reconditioning",condition: "Fair"      },
  { id: 5, customer: "Arjun Mehta",   make: "Tata",   model: "Nexon XZA+",    year: 2022, mileage: 18000, color: "Daytona Grey", kbbValue: 940000,  bbValue: 960000,  offerMade: 950000, reconCost: 8000,  status: "Completed",     condition: "Excellent" },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications = [
  { id: 1, type: "warning", title: "Low Parts Alert",         body: "3 parts are critically low — Engine Air Filter, Cabin Filter, Spark Plugs",   time: "5m ago",  read: false },
  { id: 2, type: "success", title: "Deal Closed – Kavya Nair",body: "2024 Kia Seltos delivered. Revenue: $31,500",                                  time: "1h ago",  read: false },
  { id: 3, type: "info",    title: "New Lead from Autotrader", body: "Priya Sharma enquired about Ford Explorer ST — assigned to Raj P.",           time: "2h ago",  read: false },
  { id: 4, type: "warning", title: "F&I E-Sign Pending",       body: "Rahul Verma's BMW deal documents awaiting signature",                         time: "3h ago",  read: true  },
  { id: 5, type: "success", title: "Credit Approved",          body: "HDFC Bank approved Arjun Mehta's application at 7.2%",                        time: "4h ago",  read: true  },
  { id: 6, type: "info",    title: "Service Completed",        body: "Anjali Das – Honda City service completed. Customer notified.",                time: "5h ago",  read: true  },
  { id: 7, type: "warning", title: "Vehicle 44 Days on Lot",   body: "2023 Tesla Model 3 has been on lot 44 days — consider price adjustment",      time: "1d ago",  read: true  },
  { id: 8, type: "info",    title: "Monthly Report Ready",     body: "March 2026 performance report is ready for review",                           time: "1d ago",  read: true  },
];

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
export const dashboardStats = {
  totalInventory: 248,
  openLeads: 84,
  monthlyRevenue: 2400000,
  serviceBookings: 37,
  inventoryChange: "+14 this week",
  leadsChange: "+23% conversion",
  revenueChange: "+8.2% vs last month",
  serviceChange: "−3 vs yesterday",
  leadSources: [
    { label: "Web / Digital",      pct: 42, color: "#3b82f6" },
    { label: "Autotrader / 3rd Party", pct: 28, color: "#e8a020" },
    { label: "Phone",              pct: 18, color: "#22c55e" },
    { label: "Walk-in",            pct: 12, color: "#6b7280" },
  ],
  monthlyChart: [
    { month: "Oct", new: 60, used: 35, service: 20 },
    { month: "Nov", new: 65, used: 38, service: 22 },
    { month: "Dec", new: 55, used: 32, service: 18 },
    { month: "Jan", new: 70, used: 40, service: 25 },
    { month: "Feb", new: 75, used: 42, service: 23 },
    { month: "Mar", new: 82, used: 45, service: 28 },
  ],
  kpis: {
    operationalEfficiency: "−34%",
    fiPenetration: "78%",
    csat: "4.7",
    forecastAccuracy: "91%",
    inventoryTurnDays: 18,
    marketDaysSupply: 24,
    avgGrossProfit: 3240,
  }
};
