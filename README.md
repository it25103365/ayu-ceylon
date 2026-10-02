# Ayu Ceylon (ආයු සිලෝන්) 🌿
### Traditional Sri Lankan Ayurvedic Medicine Storefront & Management Platform
**Gampaha Wedaarachchi Heritage (ගම්පහ වෙද ආරච්චි පාරම්පරික වෙද මැදුර)**

A modern, secure e-commerce and apothecary platform tailored specifically for traditional Sri Lankan Ayurvedic medicines.

---

## 🌟 Key Features

### 🛒 1. Public Storefront (No Login Required)
- **Authentic Sinhala Typography**: Built with Unicode **Noto Sans Sinhala** & **Noto Serif Sinhala** for correct rendering of complex Sinhala conjuncts.
- **Bilingual Experience**: Fully localized in authentic Sinhala (ප්‍රධාන භාෂාව) with an instant English toggle in the navigation bar.
- **Live Search & Category Filtering**: Instant real-time search across Sinhala and English medicine names, descriptions, and ingredients. Categories include:
  - තෙල් වර්ග (Herbal Oils)
  - පැණි වර්ග (Syrups & Tonics)
  - චූර්ණ සහ කුඩු (Herbal Powders)
  - පස්පංගුව සහ තේ (Herbal Infusions & Teas)
  - ආලේපන සහ ක්‍රීම් (Balms & Pastes)
- **Medicine Detail Page (`/medicine/[id]`)**: Full Ayurvedic details including ingredients (අඩංගු ඖෂධ), traditional directions & anupana (භාවිතයට උපදෙස් සහ අනුපාන), stock status, and direct purchase.
- **Cart & Slide-out Basket**: Interactive quantity adjustment, item removal, and persistent cart memory.
- **Simple Order Form (`/cart`)**: Fast checkout with customer name, phone number (WhatsApp preferred), delivery address, and city. No forced registration or password creation required. Supports Cash on Delivery (COD) and Bank Transfer. Instant order tracking reference number (e.g. `AYU-2026-XXXX`).

---

### 🛡️ 2. Owner-Only Admin System
- **Exactly ONE Admin Account**: Created strictly via the database seed script using environment variables (`ADMIN_EMAIL` and `ADMIN_PASSWORD`). No public registration endpoints exist.
- **Secure Authentication**:
  - Passwords hashed with `bcryptjs` (salt rounds: 10).
  - Secure `httpOnly`, `SameSite=lax` cookie sessions (`ayu_admin_session`) powered by signed JWTs.
- **Brute-Force Rate Limiting**: In-memory IP rate limiter locking out attackers after 5 consecutive failed login attempts for 15 minutes.
- **Strict Server-Side Protection (Defense-in-Depth)**:
  - All `/admin/*` routes are protected by Next.js middleware and server component checks redirecting unauthenticated users to `/login`.
  - All `/api/admin/*` API endpoints are protected server-side with an admin session guard returning an explicit `403 Forbidden` JSON error for any unauthorized or forged request.
- **Dynamic Navigation**: "Admin Panel" and "+ Add Medicine" buttons appear in the menu only when the authenticated owner is logged in.
- **Full Admin Panel (`/admin`)**:
  - Live metrics: Total medicines, low stock alerts (<10 units), total orders, and gross revenue.
  - **Medicine Management**: Add new medicine, edit existing remedies, update stock, delete with confirmation.
  - **Secure Image Upload**: Validates MIME types (JPG, PNG, WebP) and restricts file sizes to under 5MB, saving directly to `/public/uploads/`.
  - **Orders Management**: View all incoming customer orders with contact information, delivery addresses, ordered items, and live order status dropdown (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED).

---

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4 with bespoke Ayurvedic apothecary color scheme (Emerald, Forest Green, Gold, Linen)
- **Database & ORM**: SQLite (`prisma/dev.db`) + Prisma ORM
- **Authentication**: `bcryptjs` + `jose` (JWT) + Secure `httpOnly` cookies
- **Fonts**: `Noto Sans Sinhala` & `Noto Serif Sinhala` via Google Fonts
- **Icons**: `lucide-react`

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- Node.js 18.18+ (tested on Node v24)
- npm or pnpm

### 2. Configure Environment Variables
Create or inspect the `.env` file in the project root:
```env
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="admin@ayuceylon.lk"
ADMIN_PASSWORD="AyuCeylon@Admin2026"
ADMIN_NAME="Gampaha Wedaarachchi (Ayu Ceylon Owner)"
JWT_SECRET="ayuceylon_super_secret_jwt_key_2026_sinhala_traditional_medicine"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed
Push the Prisma schema to create the SQLite database and seed the owner admin account along with authentic Ayurvedic medicines:
```bash
# Push schema to SQLite
npx prisma db push

# Seed Admin account and 10 traditional medicines
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Owner Credentials
- **Login URL**: `http://localhost:3000/login`
- **Email**: `admin@ayuceylon.lk`
- **Password**: `AyuCeylon@Admin2026`

---

## 🧪 Security & Unauthorized Access Verification
To test that normal visitors cannot access the admin panel or admin APIs:

### 1. Test Admin API Route Without Authentication:
```bash
curl -i http://localhost:3000/api/admin/medicines
```
**Expected Response:**
```json
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Forbidden. Admin access required.",
  "code": "FORBIDDEN"
}
```

### 2. Test Admin Orders API Without Authentication:
```bash
curl -i http://localhost:3000/api/admin/orders
```
**Expected Response:** `403 Forbidden`

### 3. Test Admin Page UI Access Without Authentication:
Visit `http://localhost:3000/admin` in an incognito window.
**Expected Response:** Redirected directly to `/login?callbackUrl=/admin`.

---

## 📂 Project Structure
```
Ayu Ceylon/
├── prisma/
│   ├── schema.prisma           # SQLite Database Schema (Admin, Medicine, Order, OrderItem)
│   ├── seed.ts                 # Database seed script for Owner Admin & Remedies
│   └── dev.db                  # Local SQLite database
├── public/
│   ├── branding/               # User brand posters and heritage logos
│   ├── medicines/              # High-res herbal product photography
│   └── uploads/                # Admin uploaded images (max 5MB)
├── src/
│   ├── app/
│   │   ├── admin/              # Owner-only Admin Dashboard & CRUD pages
│   │   │   ├── medicines/new/  # Add new medicine page
│   │   │   ├── medicines/[id]/edit/ # Edit medicine page
│   │   │   └── page.tsx        # Dashboard metrics, medicines & orders table
│   │   ├── api/
│   │   │   ├── admin/          # Strictly protected 403 admin API routes
│   │   │   ├── auth/           # Login, logout, rate limiter, me endpoints
│   │   │   ├── medicines/      # Public remedies search API
│   │   │   └── orders/         # Public customer order placement API
│   │   ├── cart/               # Basket & Checkout form page
│   │   ├── login/              # Admin login page with rate limiting
│   │   ├── medicine/[id]/      # Medicine detail page with anupana & usage
│   │   ├── globals.css         # Apothecary design system & Sinhala typography
│   │   ├── layout.tsx          # Root layout with Noto Sans Sinhala & providers
│   │   └── page.tsx            # Home page with hero, search, & heritage story
│   ├── components/             # Reusable UI components (Navbar, CartDrawer, Storefront, etc.)
│   ├── context/                # Language (si/en), Cart, and Auth state contexts
│   ├── lib/
│   │   ├── adminGuard.ts       # Server-side 403 API protection guard
│   │   ├── auth.ts             # JWT, bcrypt, cookie session, and rate limiter
│   │   └── prisma.ts           # Prisma client singleton
│   └── middleware.ts           # Next.js route protection middleware
├── .env                        # Environment variables (Credentials & DB)
├── package.json
└── tsconfig.json
```
