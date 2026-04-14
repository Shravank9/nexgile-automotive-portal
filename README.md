# 🚗 Nexgile Automotive Retail Portal

Full-featured React automotive dealership portal with unified inventory, leads, sales, F&I, and service operations — all in one real-time platform.

**Live Demo:** https://nexgile-automotive-portal.vercel.app/

---

## 🔐 Quick Access - Demo Credentials

**Use these to access the live portal:**

| Role | Email | Password |
|------|-------|----------|
| Admin/Manager | `manager@nexgile.com` | `demo123` |
| Demo User | `test@nexgile.com` | `demo123` |

Credentials are also displayed on the login page in an expandable info panel.

---

## ⚡ Quick Start (Local Development)

### Install & Run
```bash
cd nexgile-portal
npm install
npm start
```

The app opens at **http://localhost:3000** and auto-redirects to the dashboard.

---

## 📁 Project Structure

```
nexgile-portal/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Icons.jsx       ← All SVG icons
│   │   ├── Sidebar.jsx     ← Nav sidebar with React Router links
│   │   ├── Topbar.jsx      ← Header with search bar
│   │   ├── NotifPanel.jsx  ← Notifications panel
│   │   ├── KpiCard.jsx     ← KPI card component
│   │   └── Toast.jsx       ← Notification toasts
│   ├── data/
│   │   └── staticData.js   ← All static sample data
│   ├── pages/
│   │   ├── Dashboard.jsx   ← /dashboard
│   │   ├── Analytics.jsx   ← /analytics
│   │   ├── Inventory.jsx   ← /inventory
│   │   ├── Leads.jsx       ← /leads
│   │   ├── Sales.jsx       ← /sales
│   │   ├── FI.jsx          ← /fi (Finance & Insurance)
│   │   ├── Service.jsx     ← /service
│   │   ├── Appraisal.jsx   ← /appraisal
│   │   ├── Notifications.jsx ← /notifications
│   │   ├── Settings.jsx    ← /settings
│   │   └── Login.jsx       ← Login page
│   ├── context/
│   │   └── CurrencyContext.js ← Global context
│   ├── App.jsx             ← Main router & layout
│   ├── index.css           ← Global styles & design tokens
│   └── index.js            ← Entry point
├── package.json
└── README.md
```

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Operations Dashboard | KPI cards, deal pipeline, charts, schedules |
| `/analytics` | Analytics | Sales forecasting & BI dashboards |
| `/inventory` | Vehicle Inventory | Search, filter, add/edit/delete vehicles |
| `/leads` | Lead Management | CRM-style lead pipeline & status tracking |
| `/sales` | Sales & Deals | Deal pipeline with live desking calculator |
| `/fi` | Finance & Insurance | F&I products & deal management |
| `/service` | Service & Parts | Workshop bookings & parts inventory |
| `/appraisal` | Appraisal | Vehicle appraisal records & valuations |
| `/notifications` | Notifications | Real-time alerts & updates |
| `/settings` | Settings | User preferences & account management |

---

## ✅ Features Per Page

### Dashboard (`/dashboard`)
- 4 KPI cards with sparklines (Inventory, Leads, Revenue, Service)
- Alert strip for pending tasks
- Active deals pipeline table with progress bars
- Lead source breakdown (progress bars)
- KPI Snapshot panel
- Today's service schedule
- Monthly performance bar chart
- Revenue mix donut chart

### Analytics (`/analytics`)
- Sales forecasting dashboard
- Performance metrics & trends
- BI dashboard with KPIs
- Historical data analysis
- Revenue breakdowns

### Inventory (`/inventory`)
- Filter by Type (New/Used/CPO), Category (SUV/Sedan/EV), Status
- Live search by make, model, VIN, color
- Add new vehicle (modal form)
- Edit & delete vehicles with confirmation
- Color-coded margin and days-on-lot indicators
- Toast notifications on all CRUD actions

### Leads (`/leads`)
- Status filter tabs with live counts
- Search by name, phone, email, interest
- Add/Edit leads via modal
- Inline status dropdown for updates
- Color-coded status tags
- Conversion rate KPI cards

### Sales (`/sales`)
- Deal pipeline with stage progress bars
- Inline status dropdown to advance deals
- Add new deal modal (pulls vehicle list)
- **Interactive Desking Calculator:**
  - Sale Price, Trade-In, Down Payment, Rate, Term, Tax
  - Real-time Monthly Payment calculations
  - Purchase / Lease / Balloon tabs
  - "Send to F&I" button

### F&I (`/fi`)
- F&I product selection
- Deal approvals & e-signatures
- Finance options & terms
- Product packaging

### Service (`/service`)
- **Tab 1: Service Bookings**
  - All bookings with bay, customer, vehicle, service, cost
  - Status updates via dropdown
  - Add/Edit booking modal
- **Tab 2: Parts Inventory**
  - Stock levels with color-coded status
  - +/− stock adjustment buttons
  - Auto-order flag indicator
  - Critical stock alerts

### Appraisal (`/appraisal`)
- Vehicle appraisal records
- Market value comparisons
- Condition assessments
- Trade-in valuations

### Notifications (`/notifications`)
- Real-time alerts panel
- Alert filtering by type
- Mark as read/unread functionality

### Settings (`/settings`)
- User profile management
- Preferences & theme settings
- Account security options

---

## 🎨 Design System

- **Primary Font:** Syne (headings) + DM Sans (body)
- **Color Palette:** Dark (#090b0f) + Amber accent (#e8a020)
- **CSS Variables:** Fully defined in `src/index.css` `:root`
- **No Component Libraries:** All custom CSS, fully responsive
- **Dark/Light Mode:** Toggle available in settings
- **Responsive:** Mobile-optimized with sidebar overlay on small screens

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-is": "^19.2.4",
  "react-router-dom": "^6.22.0",
  "react-scripts": "5.0.1"
}
```

**No backend. No database. 100% static sample data.** Ready for backend integration.

---

## 🧠 Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React 18.2 |
| Routing | React Router DOM v6 |
| State Management | React useState/useContext |
| Styling | Pure CSS (no Tailwind/Bootstrap) |
| Data | Static JavaScript arrays |
| Icons | Inline SVG components |
| Charts | Pure CSS bars & donuts |
| Build Tool | Create React App |
| Node Runtime | 24.x |
| Deployment | Vercel |

---

## 🚀 Deployment & Production

### Live Portal
**URL:** https://nexgile-automotive-portal.vercel.app/

### Deployment Details
- **Platform:** Vercel (Auto-deployed from GitHub pushes)
- **Repository:** https://github.com/Shravank9/nexgile-automotive-portal
- **Branch:** main
- **Runtime:** Node.js 24.x
- **Build Command:** `npm ci && npm run build`
- **Project Root:** `nexgile-portal/` (multi-folder setup)
- **Output Directory:** `build/`

### Deployment Configuration
See [vercel.json](vercel.json) for Vercel build configuration:
```json
{
  "root": "nexgile-portal",
  "buildCommand": "npm ci && npm run build",
  "outputDirectory": "build"
}
```

---

## 📋 Sample Data

All data is static and defined in [nexgile-portal/src/data/staticData.js](nexgile-portal/src/data/staticData.js):

- **10 sample vehicles** with prices, margins, conditions
- **8 leads** with status pipeline
- **7 active service bookings** with costs & scheduling
- **6 F&I deals** with finance terms & approvals
- **5 trade-in appraisals** with valuations
- **12+ notifications** across all modules
- **Monthly performance metrics** for charts

---

## 💡 Key Features

✅ **Real-time Dashboard** - KPIs, alerts, live data  
✅ **Unified Inventory** - Vehicle management with search & filters  
✅ **CRM System** - Lead pipeline & conversion tracking  
✅ **Sales Tools** - Desking calculator & deal management  
✅ **F&I Module** - Finance packages & e-signature ready  
✅ **Service Management** - Bookings & parts inventory  
✅ **Analytics** - Sales forecasting & BI dashboards  
✅ **Responsive Design** - Works on desktop, tablet, mobile  
✅ **Dark Mode** - Theme toggle in settings  
✅ **Toast Notifications** - User feedback on all actions  
✅ **Modal Forms** - Add/Edit/Delete with confirmation  
✅ **Static Data** - No backend needed (can integrate APIs later)

---

## 🔧 Development

### Run Locally
```bash
cd nexgile-portal
npm install
npm start
```

### Build for Production
```bash
npm run build
```

Output: `build/` folder ready for deployment

### Git Workflow
```bash
# Make changes
git add .
git commit -m "Your message"
git push origin main
```

Vercel automatically redeploys on every push to `main`.

---

## 📚 Documentation

- **Setup Instructions:** See `nexgile-portal/SETUP.md` for detailed local setup
- **Root Setup:** See `SETUP.md` for project overview & tech details

---

## 🤝 About

Built for **Nexgile Technologies** - Automotive Retail Portal Assessment

A complete, production-ready React frontend for automotive dealership operations. Features unified CRM, inventory, sales, F&I, and service modules with real-time dashboards and sample data.

**Status:** ✅ Live & Fully Functional  
**Version:** 1.0.0  
**License:** MIT
