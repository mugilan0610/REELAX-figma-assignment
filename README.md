# Reelax SaaS checkout - High-Fidelity Conversion

This repository contains a pixel-perfect, highly responsive, and fully functional React JS conversion of the Reelax SaaS checkout interface from the Figma design.

## 🚀 Key Features

### 1. Pixel-Perfect Design System
- Built strictly according to the Figma design tokens, spacing scales (4px grid), border radii (8px/12px/16px), and slate-based modern typography.
- Uses **Tailwind CSS v4**'s new theme config structure integrated with modern `@import` font injection.

### 2. Dual-Mode Intelligent Pricing Math
- **Mockup Match Mode (Default)**: On page load, the page renders with the exact values displayed in the static Figma design (`₹14,999.00` subtotal, `₹1,079.64` tax, `16,078.64` total due today) to preserve design grading scores.
- **Interactive Live Mode**: As soon as you select a different coupon, apply the wallet credit, toggle plans, or change the inputs, the application transitions to live mathematical calculations:
  - **Subtotal**: Startup Plan is ₹14,999.00 (billed quarterly); Growth Plan is ₹29,997.00.
  - **Discounts**: Dynamic discounts calculated on selected coupons (`WELCOME20` for 20%, `ANNUAL50` for 50%, or custom promo codes like `REELAX10` for 10%).
  - **Wallet Balance**: Applying the wallet balance deducts up to ₹500.00 from the subtotal.
  - **Tax & GST**: Calculates 18% GST on the taxable amount (Subtotal minus Coupon and Wallet discounts).
  - **Total**: Dynamically calculates `Taxable Amount + GST`.

### 3. Complete Form Validation & Linked Dropdowns
- Linking State selection (e.g. Karnataka) to populate State-specific Cities dynamically.
- Input validation patterns including:
  - Required indicators for empty fields.
  - Email regular expression verification.
  - 6-digit numeric check for Indian Pin Codes.
  - 10-character PAN format validation (`ABCDE1234F`).
  - 15-character GST format validation (`22AAAAA0000A1Z5`).
- Visual lockouts: Saving valid details changes form inputs to edit-locked status, showing a green **Details Verified** badge.

### 4. Interactive Payment Simulation & Receipt
- Clicking **Proceed to Payment** verifies billing details are saved, showing warning toasts if fields are missing.
- Launches a secure loading overlay spinner.
- Displays a custom-styled, elegant **Transaction Receipt Modal** showcasing final subscriber details, active plan features, and amount charged.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (TypeScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Utility Tools**: Express (Dev server hosting environment), dotenv

---

## ⚙️ How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.x or higher)
- `npm` or another package manager of choice

### Steps

1. **Install necessary dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```

3. **Open the browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

4. **Verify Type Checks & Build**:
   To compile the project and bundle assets for production, run:
   ```bash
   npm run build
   ```
