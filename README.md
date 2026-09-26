# 🚀 SwiftBill — Enterprise Multi-Business Offline POS & Windows Desktop Suite

An offline-first **Point-of-Sale (POS), Inventory, Order Ledger & Multi-Business Billing Counter Suite** available as both an **Online Web Application** and a **Standalone Offline Windows Native Application (.exe)**.

SwiftBill operates **100% locally with zero internet dependency**, zero cloud subscriptions, and instant response times. It comes pre-configured with dedicated workflows for 4 distinct retail business types, full mobile phone/tablet responsiveness, 80mm thermal receipt printing, A4 GST tax invoices, native Windows file backup/restore dialogs, and real-time customer purchase audit ledgers.

---

## 🌐 Live Web & Desktop Application Links

* **🌐 Live Online Web Application**: [https://swiftbill-offline-pos-aug12-2026.vercel.app](https://swiftbill-offline-pos-aug12-2026.vercel.app)
* **📦 Web App GitHub Repository**: [https://github.com/Tarun2231/swiftbill-offline-pos_-Aug12-2026.git](https://github.com/Tarun2231/swiftbill-offline-pos_-Aug12-2026.git)
* **💻 Windows Desktop App Branch/Repo**: `swiftbill-windows-desktop` branch & dedicated repository

---

## 🌟 Key Features

### 🏢 1. Multi-Business Workspaces (Switch Profiles Anytime)
* **🛒 Grocery, Fruits, Vegetables & Meat**: Fractional weight scale simulator (`kg`, `g`, `pcs`, `pkts`), perishable stock tracker, fast category filter.
* **🚗 Automotive Garage & Car Detailing**: Pre-service vehicle inspection checklist (fuel, battery, scratches), vehicle registration number tracker (`MH 12 AB 1234`), odometer reading, technician assignment.
* **🍽️ Restaurant & Cafe Dining POS**: Interactive table seating floorplan, live dining timers, Kitchen Display System (KDS / KOT) with order status progression (`Preparing` ➔ `Ready` ➔ `Served`).
* **📦 General Retail Superstore**: Barcode label generator & sticker sheet printer (`Code128`), instant SKU scanning, and inventory threshold alerts.
* **➕ Custom Workspace Creator**: Easily add new custom profiles (e.g. Pharmacy, Bakery, Hardware) with custom currencies (`₹`, `$`, `€`, `£`).

---

### 💻 2. Windows Native Desktop Application & Offline Local Database
* **Standalone Windows Executable**: Runs directly as a native Windows desktop app without needing a web browser or active internet connection.
* **Native Windows Save/Open Backup Dialogs**: Download full database snapshots to `.json` backup files anywhere on your Windows PC hard drive, and load/restore them on another Windows machine effortlessly.
* **100% Data Persistence**: Stores inventory, bills, customer credit ledgers, and sales reports locally in Windows application data storage.

---

### 📜 3. Complete Customer Purchase Records & Re-Order History
* **Lifetime Customer Profile**: View total lifetime spend (₹), total orders placed, and outstanding credit/due balances.
* **Purchased Items Breakdown**: See all items a customer has ever purchased with exact quantities, rates, and timestamps.
* **1-Click Repeat Order**: Re-add a customer's favorite items from past bills directly into today's cart with 1 click.
* **Customer Ledger & Udhar**: Partial payment tracking, credit settlement, and payment receipt generator.

---

### 🖨️ 4. Dual Receipt & Invoice Printing
* **80mm Thermal POS Slip**: Compact format with dynamic UPI QR code, GST breakdown (CGST/SGST), custom header/footer, and auto-print capability.
* **Full A4 GST Tax Invoice**: Professional tax invoice with store GSTIN, customer tax details, itemized HSN/SKU, and authorized signature stamp.

---

### 📱 5. Mobile, iPad & Multi-Device Responsive (3-Tier Breakpoint Architecture)
* **Desktop & Laptops (`> 992px`)**: Permanent 260px left sidebar + full side-by-side POS Billing layout with zero topbar clutter.
* **iPad & Tablets (`768px – 992px`)**: Off-canvas drawer menu (`☰`) + 2-Column POS Billing layout with 3-5 product card columns side-by-side with Order Summary cart panel.
* **Mobile Phones (`<= 768px`)**: Single-column view with top segmented tab switcher (`Browse Menu` | `Bill (₹Total)`) and floating bottom cart bar.
* Features a built-in **Touch Numeric Keypad** for effortless 1-finger PIN unlocking on mobile screens.

---

### ⏸️ 6. Multi-Customer Sessions (Pause / Resume Cart) & Phone-First Checkout
* **Pause Customer Cart**: When a customer needs time to think or fetch forgot items, click `⏸️ Pause Cart` to save their session with their mobile number.
* **Serve Next Customer**: Immediately log in another customer using their mobile number and complete their transaction without waiting or losing data.
* **Resume Previous Cart**: Pick up paused carts from the top notification banner at any time and complete checkout seamlessly.
* **Phone-Number First Workflow**: Enter or confirm customer mobile numbers upfront during checkout or cart pause for accurate record keeping.

---

### 👥 7. Staff Accounts & Security PIN
* **Master Admin PIN**: `1234` (Can be changed in Store Settings & Security panel).
* **Multi-User Staff Roles**: Cashier and Master Admin profiles with individual shift tracking.

---

## 💾 How Local Data Backup & Restore Works (Step-by-Step)

### Exporting Backup on Machine A:
1. Open SwiftBill (Web or Windows Desktop App).
2. Go to **Store Settings** ➔ **Data Safety & JSON Backups**.
3. Click **`💾 Download Full JSON Backup`**.
4. In Desktop App mode, Windows native **Save As** file dialog opens automatically to let you choose where to save the `.json` backup file.

### Restoring Backup on Machine B:
1. Open SwiftBill on the second Windows PC / Browser.
2. Go to **Store Settings** ➔ **Data Safety & JSON Backups**.
3. Click **`📂 Select Backup File (.json)`**.
4. Select the `.json` file exported from Machine A. All store data, inventory, and customer ledgers will instantly load and sync!

---

## 🛠️ How to Run & Build

### Prerequisites
* [Node.js](https://nodejs.org/) (Version 18 or higher)
* NPM / Git

---

### 1. Web Application (Development & Production Build)
```bash
# Install dependencies
npm install

# Run web app in local dev mode (http://localhost:5173)
npm run dev

# Build production web bundle (output in dist/)
npm run build
```

---

### 2. Windows Native Desktop Application
```bash
# Run Windows desktop app in dev mode (Electron + Vite)
npm run electron:dev

# Build standalone Windows executable package (output in release/)
npm run electron:build
```

---

## 🚢 Dual GitHub Deployment Workflow

Whenever updates or new features are introduced:
1. **Web App Repository / Main Branch**: Updated and pushed to `origin/main` (triggers automatic Vercel online deployment).
2. **Windows Desktop App Branch / Repo**: Updated and pushed to `origin/swiftbill-windows-desktop` containing Electron configuration, native IPC bridges, and desktop build manifests.

---

## 📄 License
This project is open-source and free for personal and commercial offline retail management.
