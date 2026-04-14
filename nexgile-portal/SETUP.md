# Nexgile Automotive Retail Portal
## Setup & Run Guide for VS Code

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
│   │   └── Toast.jsx       ← Notification toasts
│   ├── data/
│   │   └── staticData.js   ← All static/fake data
│   ├── pages/
│   │   ├── Dashboard.jsx   ← /dashboard
│   │   ├── Inventory.jsx   ← /inventory
│   │   ├── Leads.jsx       ← /leads
│   │   ├── Sales.jsx       ← /sales
│   │   └── Service.jsx     ← /service
│   ├── App.jsx             ← Router + Layout
│   ├── index.css           ← Global styles + design tokens
│   └── index.js            ← Entry point
├── package.json
└── SETUP.md
```

---

## ⚡ Quick Start

### Step 1 — Open in VS Code
```bash
cd nexgile-portal
code .
```

### Step 2 — Install Dependencies
Open the integrated terminal (Ctrl + ` ) and run:
```bash
npm install
```

### Step 3 — Start the App
```bash
npm start
```
The app will open at **http://localhost:3000** and auto-redirect to **http://localhost:3000/dashboard**

---

## 🗺 Pages & Routes

| Route         | Page                  | Description                                  |
|---------------|-----------------------|----------------------------------------------|
| `/dashboard`  | Operations Dashboard  | KPI cards, deal pipeline, charts, schedule   |
| `/inventory`  | Vehicle Inventory     | Search, filter, add/edit/delete vehicles     |
| `/leads`      | Lead Management       | CRM-style lead pipeline, status updates      |
| `/sales`      | Sales & Deals         | Deal table + live desking calculator         |
| `/service`    | Service & Parts       | Workshop bookings + parts stock management   |

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

### Inventory (`/inventory`)
- Filter by Type (New / Used CPO), Category (SUV/Sedan/EV...), Status
- Live search by make, model, VIN, color
- Add new vehicle (modal form)
- Edit existing vehicle (modal form)
- Delete with confirmation dialog
- Color-coded margin and days-on-lot indicators
- Toast notifications on all CRUD actions

### Leads (`/leads`)
- Status filter tabs with live counts
- Search by name, phone, email, interest
- Add / Edit leads via modal
- Inline status dropdown (select to update → shows toast)
- Color-coded status tags
- Conversion rate KPI cards

### Sales (`/sales`)
- Deal pipeline table with stage progress bars
- Inline status dropdown to advance deal stage
- Add new deal via modal (pulls available vehicles list)
- **Interactive Desking Calculator** — live calculations:
  - Sale Price, Trade-In, Down Payment, Rate, Term, Tax
  - Real-time Monthly Payment computed
  - Purchase / Lease / Balloon tabs
  - "Send to F&I" button

### Service (`/service`)
- **Tab 1: Service Bookings**
  - All bookings with bay, customer, vehicle, service, cost
  - Status update via dropdown
  - Add / Edit booking modal
- **Tab 2: Parts Inventory**
  - Stock levels with color-coded status
  - +/− stock adjustment buttons
  - Auto-order flag indicator
  - Critical stock alert strip
  - Add / Edit parts modal

---

## 🎨 Design System

- **Primary font**: Syne (headings) + DM Sans (body)
- **Color palette**: Dark (#090b0f) + Amber accent (#e8a020)
- **CSS variables**: All in `src/index.css` `:root`
- **No external component libraries** — all custom CSS

---

## 📦 Dependencies

```json
"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-router-dom": "^6.22.0",
"react-scripts": "5.0.1"
```

No other dependencies needed. No backend. No database. 100% static data.

---

## 🧠 Tech Stack Summary

| Item             | Choice                    |
|------------------|---------------------------|
| Framework        | React 18                  |
| Routing          | React Router DOM v6       |
| Styling          | Pure CSS (no Tailwind)    |
| State            | React useState            |
| Data             | Static JS arrays          |
| Icons            | Inline SVG components     |
| Charts           | Pure CSS bar/donut        |
| Build Tool       | Create React App          |

---

## 🔐 Demo Login Credentials

### Local Development
When running locally on `http://localhost:3000`, use:

| Email | Password |
|-------|----------|
| `manager@nexgile.com` | `demo123` |
| `test@nexgile.com` | `demo123` |

### Live Deployment
**Public URL:** https://nexgile-automotive-portal.vercel.app/

Same credentials work on the live deployment. Credentials are also displayed in an expandable info panel on the login page.

---

*Built for Nexgile Technologies – Automotive Retail Portal Assessment*
