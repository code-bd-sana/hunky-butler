# Hunky Butler Service — Comprehensive Architecture, API & Security Report

---

## Executive Summary

This document provides a detailed breakdown of the **Hunky Butler Service** codebase (Frontend & Backend), including website architecture, user flows, complete API inventory, step-by-step instructions on creating and integrating new APIs, and a comprehensive security audit detailing public API protection and privacy enforcement.

---

## 1. System Architecture & Tech Stack

| Layer | Technology | Version / Key Details |
| :--- | :--- | :--- |
| **Frontend Core** | Next.js (App Router) | Version `16.0.7` (React 19.1.0) |
| **Styling & Animation** | Tailwind CSS & Motion | Tailwind CSS v4, Framer Motion / Motion |
| **State & Auth** | Redux Toolkit & NextAuth.js | Redux Toolkit `2.9.0`, NextAuth `4.24.11` |
| **Backend Framework** | Node.js & Express.js | Express `5.1.0` (ES Modules) |
| **Database & ODM** | MongoDB & Mongoose | Mongoose `8.18.1` |
| **Payment Gateway** | Square SDK | Official `@square/client` SDK `38.0.0` |
| **Real-time WebSockets** | Socket.IO | Version `4.8.1` (Client & Server) |
| **Transactional Messaging**| Nodemailer & Twilio | Hostinger SMTP (`6.9.11`), Twilio Node SDK |

---

## 2. Website Flow & User Roles

The application caters to three main user roles: **Customer**, **Butler**, and **Admin**.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT / FRONTEND                                 |
|                                (Next.js 16 App Router)                            |
|                                                                                   |
|  +-------------------+     +---------------------+     +-----------------------+  |
|  | Quote Calculator  |     | User / Admin Dash   |     | Dynamic Location SEO  |  |
|  +---------+---------+     +----------+----------+     +-----------------------+  |
+------------|--------------------------|-------------------------------------------+
             |                          |
   REST API  |                Socket.IO | Real-time Chat & Notifications
   Requests  v                          v
+-----------------------------------------------------------------------------------+
|                                 BACKEND SERVER                                    |
|                            (Express 5.x on Node.js)                               |
|                                                                                   |
|  +-------------------+     +---------------------+     +-----------------------+  |
|  |  Booking Engine   |     | Auth Middleware     |     | Webhook Raw Middleware|  |
|  +---------+---------+     +----------+----------+     +-----------+-----------+  |
|            |                          |                            |              |
|            v                          v                            v              |
|  +-------------------+     +---------------------+     +-----------------------+  |
|  | payment.controller|     | user.controller     |     | handleSquareWebhook   |  |
|  +---------+---------+     +---------------------+     +-----------+-----------+  |
+------------|-------------------------------------------------------|--------------+
             |                                                       |
             | Mongoose ODM                                          | Signature Verification & Event
             v                                                       v
+------------------------+                              +---------------------------+
|    DATABASE (MongoDB)  |                              |    EXTERNAL SERVICES      |
|                        |                              |                           |
| - Bookings             |                              | - Square Payments API     |
| - PaymentHistories     |                              | - Hostinger SMTP (Mail)   |
| - Users & Butlers      |                              | - Twilio API (SMS)        |
| - Services & Locations |                              | - Google OAuth 2.0        |
+------------------------+                              +---------------------------+
```

### 2.1 Customer Booking & Payment Flow
1. **Quote Generation**: The customer navigates to `/booking` (or service landing pages). Selects service type, staff count, event date, duration, and enters a UK postcode.
2. **Dynamic Price Calculation**: Distance logic calculates travel surcharges based on UK postcode distance + base service fee.
3. **Payment Selection**: Customer chooses **Full Payment** or **£20 Deposit**.
4. **Booking Pre-Save**: `POST /api/booking` creates a pending booking record in MongoDB.
5. **Square Checkout Redirect**: `POST /api/payment/create-checkout-session` generates a Square Hosted Checkout session URL.
6. **Payment Processing**: Customer completes payment on Square’s secure hosted checkout page.
7. **Webhook Synchronization**: Square sends an HTTP POST event to `/api/webhook`. The backend verifies the cryptographic HMAC-SHA256 signature, updates booking payment status to `FULLY_PAID` or `DEPOSIT_PAID`, saves payment history, and triggers Nodemailer/Twilio notifications to customer and admin.

### 2.2 Butler Flow
1. **Application**: Butler registers via `/register` (choosing butler role) or application form.
2. **Approval**: Admin reviews and approves pending butler applications via `/api/user/activeButler/:email`.
3. **Dashboard**: Butler accesses `/butler-panel` to view assigned jobs, mark availability, track earnings, and message customers/admin via Socket.IO chat.

### 2.3 Admin Flow
1. **Dashboard Overview**: Admin views real-time metrics (total revenue, active bookings, butler count) via `/api/summury/admin`.
2. **Management Modules**:
   - **Booking Management**: Assign butlers to bookings, update status (`ongoing`, `completed`, `cancelled`), delete bookings.
   - **User & Butler Management**: Approve/reject butler applications, view customer and butler directories.
   - **CMS Management**: Create/Edit/Delete Services, Locations, Blogs, and Reviews.
   - **Payment Auditing**: View system-wide transaction logs and Square payment histories.

---

## 3. Comprehensive API Inventory (56 Endpoints Total)

Below is the complete count and categorization of all API endpoints across the backend and frontend.

### Summary Table

| Category | Endpoint Count | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | 4 | Public / Protected | Registration, Login, Forgot & Change Password (Protected) |
| **OTP** | 2 | Public | Send and verify OTP codes |
| **User Management** | 8 | Protected (Admin/User) | Users, Customers, Butlers, Profiles, Applications |
| **Service Management** | 5 | Mixed (Public / Admin) | Service listing (Public), creation, updates, deletion (Admin) |
| **Blog Management** | 5 | Mixed (Public / Admin) | Blog listing (Public), creation, updates, deletion (Admin) |
| **Booking Management** | 10 | Mixed (Public / Protected)| Quote creation (Public), status update, butler assignment (Admin) |
| **Review Management** | 5 | Mixed (Public / Admin) | Submit & read reviews (Public), delete review (Admin) |
| **Butler API** | 1 | Public | Fetch approved butler list |
| **Summary Statistics** | 2 | Protected (Admin/User) | Admin dashboard (Admin) and Customer dashboard stats (User) |
| **Locations API** | 2 | Public | SEO location pages and slug queries |
| **Notifications API** | 4 | Protected | Fetch, create, and mark seen notifications |
| **Payment API** | 5 | Mixed (Public / Protected)| Square session creation (Public), payment history auditing (Admin/User) |
| **Webhooks & System** | 3 + 1 Socket | Public / Webhook | Square webhook, health check, debug email, Socket.IO |
| **Frontend Next.js APIs**| 2 | Public | NextAuth handler & Google Reviews proxy |

---

## 4. Guide: How to Create and Integrate an API

### 4.1 Step-by-Step: Creating a New API in the Backend

#### Step 1: Create or Update Mongoose Model
File: `backend/src/models/PromoCode.js`
```javascript
import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercent: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model("PromoCode", promoCodeSchema);
```

#### Step 2: Create Controller Logic
File: `backend/src/controller/promo.controller.js`
```javascript
import PromoCode from "../models/PromoCode.js";

export const createPromoCode = async (req, res) => {
  try {
    const { code, discountPercent, expiryDate } = req.body;
    const existing = await PromoCode.findOne({ code });
    if (existing) return res.status(400).json({ message: "Promo code already exists" });

    const newPromo = await PromoCode.create({ code, discountPercent, expiryDate });
    res.status(201).json({ success: true, data: newPromo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivePromos = async (req, res) => {
  try {
    const promos = await PromoCode.find({ isActive: true, expiryDate: { $gte: new Date() } });
    res.status(200).json({ success: true, data: promos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Step 3: Define Routes with Middleware
File: `backend/src/routes/promo.route.js`
```javascript
import { Router } from "express";
import { createPromoCode, getActivePromos } from "../controller/promo.controller.js";
import { verifyAdmin } from "../middleware/privateRoute.js";

const router = Router();

router.get("/", getActivePromos);                // Public endpoint
router.post("/", verifyAdmin, createPromoCode);  // Protected Admin endpoint

export default router;
```

#### Step 4: Register Route in Main Index Router
File: `backend/src/routes/index.js`
```javascript
import promoRoutes from "./promo.route.js";

// Mount the new route
router.use("/promo", promoRoutes);
```

---

### 4.2 Step-by-Step: Integrating the API into Frontend

#### Step 1: Create RTK Query API Slice
File: `frontend/features/promoApi.js`
```javascript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const promoApi = createApi({
  reducerPath: "promoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/promo`,
  }),
  tagTypes: ["Promo"],
  endpoints: (builder) => ({
    getActivePromos: builder.query({
      query: () => "/",
      providesTags: ["Promo"],
    }),
    createPromo: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Promo"],
    }),
  }),
});

export const { useGetActivePromosQuery, useCreatePromoMutation } = promoApi;
```

#### Step 2: Register API Slice in Redux Store
File: `frontend/store/store.js`
```javascript
import { promoApi } from "@/features/promoApi";

export const store = configureStore({
  reducer: {
    // ... existing reducers
    [promoApi.reducerPath]: promoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // ... existing middlewares
      promoApi.middleware
    ),
});
```

#### Step 3: Use Hook in React Component
File: `frontend/components/PromoBanner.jsx`
```jsx
"use client";
import { useGetActivePromosQuery } from "@/features/promoApi";

export default function PromoBanner() {
  const { data, isLoading, error } = useGetActivePromosQuery();

  if (isLoading) return <div>Loading offers...</div>;
  if (error || !data?.data?.length) return null;

  return (
    <div className="bg-amber-500 text-black p-3 text-center font-bold">
      Use code {data.data[0].code} for {data.data[0].discountPercent}% OFF!
    </div>
  );
}
```

---

## 5. Security Audit & Protection Implementation (FIXED)

> [!IMPORTANT]
> **SECURITY REMEDIATION COMPLETE**
> All open admin routes and customer personal data endpoints have been locked down with strict authentication & parameter ownership verification.

### 5.1 Security Remediation Implemented

1. **Authentication Middleware Locked Down**: [`backend/src/middleware/privateRoute.js`](file:///Users/syedrakibhasan/projects/hunky-butler/backend/src/middleware/privateRoute.js) now decodes NextAuth JWT tokens from session cookies and `Authorization: Bearer` headers. Permissive mock admin bypass has been completely removed. Unauthenticated calls return `401 Unauthorized`.
2. **Admin-Only Routes Protected**:
   - `GET /api/payment/allPayments` $\rightarrow$ `verifyAdmin`
   - `GET /api/user`, `GET /api/user/customers`, `GET /api/user/butlers`, `GET /api/user/all/butlerApplicaiton`, `PUT /api/user/activeButler/:email`, `PUT /api/user/rejectButler/:email` $\rightarrow$ `verifyAdmin`
   - `GET /api/booking` $\rightarrow$ `verifyAdmin`
   - `POST /api/service`, `PUT /api/service/:slug`, `DELETE /api/service/:id` $\rightarrow$ `verifyAdmin`
   - `POST /api/blogs`, `PUT /api/blogs/:id`, `DELETE /api/blogs/:id` $\rightarrow$ `verifyAdmin`
   - `DELETE /api/review/delete/:id` $\rightarrow$ `verifyAdmin`
   - `GET /api/summury/admin` $\rightarrow$ `verifyAdmin`
3. **Customer Data Ownership Enforced**:
   - `GET /api/booking/customer/:email`, `GET /api/booking/customerBooking/:email`, `GET /api/payment/customer/:email`, `GET /api/summury/customer/:email`, `GET /api/notification/:email` check that `req.user.email === email` (or user is Admin). Non-matching users receive `403 Forbidden`.
4. **Butler Data Ownership Enforced**:
   - `GET /api/booking/butlerBookingOverview/:id`, `GET /api/booking/butlerOverview/:id`, `GET /api/booking/:id`, `GET /api/payment/butler/:id` check that `req.user.id === id` (or user is Admin). Non-matching users receive `403 Forbidden`.

---

## 6. Conclusion

1. **Website Flow & Architecture**: Documented customer booking/payment flow, butler operations, and administrative dashboards.
2. **API Catalog**: Identified and cataloged all **56 API endpoints** across backend REST routes, Socket.IO gateway, webhooks, and frontend Next.js route handlers.
3. **Developer Guide**: Provided complete step-by-step guides with code samples for adding backend APIs and integrating them into the Next.js/Redux frontend.
4. **Security Hardening**: Locked down all admin and customer data endpoints with role-based access control and strict parameter-level ownership validation.

---
*Report compiled for Hunky Butler Service codebase.*
