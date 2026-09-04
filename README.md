# 🚀 SwiftBill — Enterprise Multi-Business Offline POS & Billing Counter Suite

An offline-first **Point-of-Sale (POS), Inventory, Order Ledger & Multi-Business Billing Counter Suite** built with React, Vite, and HTML5 LocalStorage. 

SwiftBill operates **100% locally with zero internet dependency**, zero cloud subscriptions, and instant response times. It comes pre-configured with dedicated workflows for 4 distinct retail business types, full mobile phone/tablet responsiveness, 80mm thermal receipt printing, A4 GST tax invoices, and real-time customer purchase audit ledgers.

---

## 🌟 Key Features

### 🏢 1. Multi-Business Workspaces (Switch Profiles Anytime)
* **🛒 Grocery, Fruits, Vegetables & Meat**: Fractional weight scale simulator (`kg`, `g`, `pcs`, `pkts`), perishable stock tracker, fast category filter.
* **🚗 Automotive Garage & Car Detailing**: Pre-service vehicle inspection checklist (fuel, battery, scratches), vehicle registration number tracker (`MH 12 AB 1234`), odometer reading, technician assignment.
* **🍽️ Restaurant & Cafe Dining POS**: Interactive table seating floorplan, live dining timers, Kitchen Display System (KDS / KOT) with order status progression (`Preparing` ➔ `Ready` ➔ `Served`).
* **📦 General Retail Superstore**: Barcode label generator & sticker sheet printer (`Code128`), instant SKU scanning, and inventory threshold alerts.
* **➕ Custom Workspace Creator**: Easily add new custom profiles (e.g. Pharmacy, Bakery, Hardware) with custom currencies (`₹`, `$`, `€`, `£`).

---

### 📜 2. Complete Customer Purchase Records & Re-Order History
* **Lifetime Customer Profile**: View total lifetime spend (₹), total orders placed, and outstanding credit/due balances.
* **Purchased Items Breakdown**: See all items a customer has ever purchased with exact quantities, rates, and timestamps.
* **1-Click Repeat Order**: Re-add a customer's favorite items from past bills directly into today's cart with 1 click.
* **Customer Ledger & Udhar**: Partial payment tracking, credit settlement, and payment receipt generator.

---

### 🖨️ 3. Dual Receipt & Invoice Printing
* **80mm Thermal POS Slip**: Compact format with dynamic UPI QR code, GST breakdown (CGST/SGST), custom header/footer, and auto-print capability.
* **Full A4 GST Tax Invoice**: Professional tax invoice with store GSTIN, customer tax details, itemized HSN/SKU, and authorized signature stamp.

---

### 📱 4. Mobile, iPad & Multi-Device Responsive (3-Tier Breakpoint Architecture)
* **Desktop & Laptops (`> 992px`)**: Permanent 260px left sidebar + full side-by-side POS Billing layout with zero topbar clutter.
* **iPad & Tablets (`768px – 992px`)**: Off-canvas drawer menu (`☰`) + 2-Column POS Billing layout with 3-5 product card columns side-by-side with Order Summary cart panel (zero column squishing!).
* **Mobile Phones (`<= 768px`)**: Single-column view with top segmented tab switcher (`Browse Menu` | `Bill (₹Total)`) and floating bottom cart bar.
* Features a built-in **Touch Numeric Keypad** for effortless 1-finger PIN unlocking on mobile screens.

---

### 🛍️ 5. Swiggy Instamart / Zepto Inspired POS Catalog & Product Cards
* **Floating `+` Add Button**: Floating on product image with live interactive `[ - ] qty [ + ]` stepper.
* **Veg / Non-Veg Emblem (`⊡`)**: Standard Indian FSSAI green circle badge on bottom-left of product photos.
* **Bookmark / Wishlist Ribbon (`🔖`)**: Save items to quick list with 1 tap.
* **Interactive Weight & Variant Pills**: Select `[ 1 kg ]`, `[ 3 kg ]`, `[ 500 g ]` or `[ 80-140 g ]` to instantly update prices, unit rates (`₹3.7/100 g`), and discount tags (`31% OFF`).
* **Quick Filters & Dropdown Sorting**: Filter by `⊶ Filters`, `Sort By` (*Recommended*, *Price: Low to High*, *Price: High to Low*, *Biggest Discount*), and `📉 Price Drop` toggle.

---

### 👥 6. Staff Accounts & PIN Management
* **Master & Admin Panel**: Create staff accounts with custom PINs, employee roles, and individual shift tracking.
* **1-Tap Switch User**: Switch between Cashier and Admin profiles on the fly without losing active billing carts.

---

## 🔒 Security & Master PIN
* **Default Admin Master PIN**: `1234`
* Admin login lock protects settings, reports, financial balances, and business switching.

---

## 💾 How Offline Local Data Storage Works (Step-by-Step)

SwiftBill uses **Browser LocalStorage API** to persist all your business data directly on your local device.

### 1. Data Hierarchy & Keys
All records are saved under namespace keys in your browser:
* `swiftbill_multi_data_v1`: Master store settings, product inventory, customer ledgers, invoices, quotations, returns, expenses, cash shifts, and kitchen orders across all business workspaces.
* `swiftbill_active_biz`: The currently active business profile ID (`grocery`, `automotive`, `restaurant`, `retail`).
* `swiftbill_theme`: Visual theme preference (`dark` or `light`).

### 2. Zero Internet Required
* Every sale, inventory adjustment, customer payment, and expense is saved synchronously to your hard drive's browser database.
* Even if your internet is completely disconnected or you restart your computer, your data remains safe and instantly accessible.

### 3. Backup & Data Portability (1-Click JSON Export)
* Navigate to **Store Settings** ➔ **Backup & Local Storage**.
* Click **`💾 Export JSON Backup`** to download a single `.json` file containing your entire business database.
* To restore your database on another computer or laptop, click **`📂 Restore Backup from JSON`** and upload your file.

---

## 🛠️ Step-by-Step: How to Run Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
* Git installed on your system

---

### Step 1: Open Terminal / Command Prompt
Navigate to the project directory:
```bash
cd offline-billing-app
```

### Step 2: Install Dependencies
Install all required Node modules:
```bash
npm install
```

### Step 3: Start the Local Development Server
Run the local Vite server:
```bash
npm run dev
```

You will see output similar to:
```
  VITE v6.x.x  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.9:5173/
```

### Step 4: Open in Your Browser
* **On your PC/Laptop**: Open your browser and go to `http://localhost:5173`
* **On your Mobile Phone / Tablet (Connected to same Wi-Fi)**: Open your mobile browser and enter the **Network URL** (e.g. `http://192.168.1.9:5173/`).
* Enter the Master PIN: **`1234`** to unlock the dashboard.

---

## 🚢 How to Push This Code to GitHub (Step-by-Step)

If you want to save and host this repository on your GitHub account:

### Step 1: Create a New Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Enter a repository name (e.g., `swiftbill-offline-pos`).
3. Choose **Public** or **Private**.
4. **Do not** check "Initialize with README" (we already created a complete README).
5. Click **Create repository**.

### Step 2: Push Local Code to Your GitHub Repository
Run these commands inside your project folder:

```bash
# 1. Initialize Git (if not already initialized)
git init

# 2. Add all files to staging
git add .

# 3. Commit the codebase
git commit -m "Initial commit: Multi-Business Offline POS & Billing Counter Suite"

# 4. Set the default branch to main
git branch -M main

# 5. Link your remote GitHub repository (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/swiftbill-offline-pos.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📂 Project Architecture

```
offline-billing-app/
├── index.html                  # HTML entry with Inter & JetBrains Mono typography
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite configuration (Host: 0.0.0.0 enabled)
├── .gitignore                  # Git ignore rules for node_modules
├── README.md                   # Complete documentation & local setup guide
└── src/
    ├── main.jsx                # Application root mounting
    ├── App.jsx                 # Main layout & workspace router
    ├── index.css               # Design system, glassmorphism & responsive CSS
    ├── context/
    │   └── BillingContext.jsx  # Offline LocalStorage state engine & multi-business data
    └── components/
        ├── AdminPortal.jsx          # Security PIN login & business workspace launcher
        ├── Sidebar.jsx              # Navigation drawer with active workspace branding
        ├── POSBilling.jsx           # Main POS counter, weighing scale & customer order history
        ├── ProductManagement.jsx    # Inventory & stock management with low-stock alerts
        ├── CustomerLedger.jsx       # Customer accounts, Udhar balances & purchase audit logs
        ├── InvoicePrintModal.jsx    # 80mm thermal slip & A4 GST tax bill print preview
        ├── InvoiceHistory.jsx       # Sales transactions audit log & refund triggers
        ├── QuotationsManager.jsx    # Price estimates & 1-tap bill conversion
        ├── ReturnsManager.jsx       # Sales returns & credit note manager
        ├── CashShiftRegister.jsx    # Daily cash drawer reconciliation & Z-report
        ├── ExpenseTracker.jsx       # Business expenses & category outflow tracking
        ├── ReportsDashboard.jsx     # Financial KPIs, revenue analytics & top sellers
        ├── RestaurantFloorplan.jsx  # Table dining layout & seating timer manager
        ├── KitchenDisplayBoard.jsx  # Live kitchen order tickets (KOT)
        ├── ServiceJobTracker.jsx    # Automotive service cards & bay management
        ├── BarcodePrinter.jsx       # Barcode sticker sheet generator (Code128)
        └── SettingsBackup.jsx       # Store configuration, GST rates & JSON backup/restore
```

---

## 📄 License
This project is open-source and free for personal and commercial offline retail management.
