<div align="center">

# 🚜 Rentora — Industrial & Heavy Equipment Rental Platform

**A full-stack, enterprise-grade equipment rental and machinery fleet management ecosystem.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.3.0-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?style=flat-square&logo=stripe)](https://stripe.com/)

</div>

---

## 📌 Project Purpose

**Rentora** is designed to modernize and streamline the equipment rental industry. It bridges the gap between verified heavy machinery owners and contractors, businesses, or individual renters looking for short-term and long-term equipment leasing. 

Rentora replaces manual equipment tracking and paperwork with a unified digital platform featuring real-time inventory management, automated Stripe payments, and dedicated role-based operational portals for Renters, Equipment Owners, and System Administrators.

---

## 🌐 Live URL & Repositories

- **Live Application:** [https://rentora-client.vercel.app](https://rentora-client.vercel.app) *(Replace with your production deployment URL)*
- **Client Repository:** [https://github.com/tamimkhan887/Rentaro-Client](https://github.com/tamimkhan887/Rentaro-Client)
- **Server Repository:** [https://github.com/tamimkhan887/Rentaro-Server](https://github.com/tamimkhan887/Rentaro-Server)

---

## 🚀 Key Features

### 1. 🔐 Role-Based Access Control (RBAC) & Authentication
- **Multi-Role Security:** Granular access permissions for **Renters / Customers**, **Equipment Owners**, and **Admins**.
- **JWT-Based API Security:** Secure access token generation (`POST /jwt`) upon login with custom Express middlewares (`verifyToken`, `verifyRenter`, `verifyOwner`, `verifyAdmin`).
- **Better-Auth Integration:** Robust credential login, Google Social OAuth sign-in, and server-side session resolution.
- **Route Protection & Diagnostics:** Next.js Proxy middleware guards private dashboard routes, with an interactive `403 Access Denied` diagnostic page (`/unauthorize`).

### 2. 💳 Stripe Payment Gateway & Automated Inventory
- **Stripe Checkout Sessions:** Seamless checkout for equipment bookings with real-time transaction verification.
- **Atomic Stock Management:** Available equipment stock reduces automatically upon successful rental booking.
- **Stock Restoration:** Cancelling a booking instantly restores reserved stock back to the owner's fleet.

### 3. 🔍 Advanced Machinery Search & Filtering
- **Backend Search:** Real-time search across equipment name, location, brand, and model.
- **Multi-Criteria Filtering:** Filter by equipment category, rental duration type (Daily, Weekly, Monthly), price range, and stock availability.
- **Dynamic Sorting:** Sort by price (low-to-high, high-to-low) or newest arrivals.

### 4. 📊 Dedicated Role-Based Dashboards
- **Customer / Renter Dashboard:**
  - View rental history, active leases, and booking timelines.
  - Manage saved favorite equipment for quick re-booking.
  - Edit personal profile details and contact information.
- **Equipment Owner Dashboard:**
  - Fleet management: list, update, and remove machinery.
  - Incoming rental requests manager with approve/reject/complete status workflows.
  - Performance analytics: total listed units, active rentals, total revenue, and monthly earnings chart.
- **Admin Command Center:**
  - Platform-wide overview: total users, listed equipment, total bookings, and overall rental revenue.
  - Equipment approval portal: review pending listings and approve or reject submissions.
  - User governance: view all registered users and modify user roles on the fly.

### 5. 🎨 Modern UI & Responsive Experience
- Built with **Next.js 16 (App Router)** and **Tailwind CSS v4**.
- Fluid transitions and micro-interactions powered by **Framer Motion**.
- Full dark and light theme switching via **next-themes**.

---

## 📦 NPM Packages & Dependencies Used

### 🖥️ Client-Side (`Rentora-Client/Rentora`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `next` | `^16.4.5` | React production framework with App Router & Turbopack |
| `react` & `react-dom` | `19.3.1` | Core React library with React 19 concurrent features |
| `better-auth` | `^1.7.26` | Type-safe authentication and session management engine |
| `@better-auth/mongo-adapter` | `^1.7.26` | MongoDB database adapter for Better-Auth |
| `@stripe/stripe-js` & `stripe` | `^10.3.0` / `^23.2.0` | Client and server Stripe payment integration |
| `framer-motion` | `^14.14.0` | Production-ready motion and gesture animation library |
| `lucide-react` | `^1.76.0` | Comprehensive icon library for modern interfaces |
| `tailwindcss` | `^4` | Utility-first CSS framework (v4 engine) |
| `@base-ui/react` | `^1.9.0` | Accessible unstyled primitives for UI components |
| `class-variance-authority` | `^0.7.1` | Declarative CSS variant management |
| `next-themes` | `^0.4.6` | Theme management for dark/light mode toggle |
| `typescript` | `^5` | Static type checking and enhanced developer experience |

### ⚙️ Server-Side (`Rentora-server`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `express` | `^5.3.0` | Fast, minimalist backend web framework |
| `mongodb` | `^7.9.1` | Official Node.js driver for MongoDB Atlas database |
| `jsonwebtoken` | `^9.0.3` | JWT token creation, signing, and cryptographic verification |
| `cors` | `^2.8.6` | Cross-Origin Resource Sharing middleware |
| `dotenv` | `^18.0.10` | Secure environment variable configuration |

---

## 🛠️ Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/) account or local MongoDB instance
- [Stripe](https://stripe.com/) Developer account for test API keys

---

### 1. Server Setup (`Rentora-server`)

```bash
cd Rentora-server
npm install
```

Create a `.env` file in the `Rentora-server` root:
```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret_key
```

Run the backend server:
```bash
npm start
# or with nodemon:
npx nodemon index.js
```

---

### 2. Client Setup (`Rentora-Client/Rentora`)

```bash
cd Rentora-Client/Rentora
npm install
```

Create a `.env` file in `Rentora-Client/Rentora`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URL=your_mongodb_connection_string

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 User Roles & Access Overview

| User Role | Accessible Portals | Permissions |
| :--- | :--- | :--- |
| **Customer / Renter** | `/dashboard/customer/*`, `/equipment/*` | Browse machinery, book rentals, complete payments, save favorites, view rental status |
| **Equipment Owner** | `/dashboard/owner/*`, `/dashboard/customer/*` | Add new machinery, edit/delete listings, review incoming rental orders, view revenue analytics |
| **Admin** | `/dashboard/admin/*`, All Dashboards | Approve/reject equipment, manage user accounts & roles, access platform-wide analytics |

---

## 📄 License

This project is licensed under the **ISC License**. Developed as part of Programming Hero Batch 14 Milestone 9.
