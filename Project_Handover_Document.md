# Project Handover Document: Hunky Butler Service

---

## 1. Project Overview

### What This Project Is
**Hunky Butler Service** is a comprehensive, production-grade web application designed for booking buff butlers, topless waiters, life drawing classes, cocktail masterclasses, and party entertainment services across the United Kingdom. The system consists of a customer-facing booking engine with real-time distance-based pricing calculations, a customer/butler/admin dashboard system, automated transactional email/SMS notifications, real-time messaging, and an integrated payment architecture using Square.

### Main Purpose
- **Customer Acquisition & Instant Quotes**: Provide users with instant, automated pricing quotes based on event location (UK postcodes), staff count, duration, and service type.
- **Seamless Booking & Payment**: Enable customers to book online and choose between paying in full or securing their date with a £20 deposit via Square Hosted Checkout.
- **Operational Management**: Provide admin and butler dashboards for booking dispatch, butler assignment, schedule tracking, payment auditing, and real-time chat.
- **Local SEO & Discovery**: Drive organic UK search traffic through automated dynamic landing pages for major UK cities, schema markup, and legacy URL redirects.

### Technologies Used

| Layer | Technology | Key Details & Version |
| :--- | :--- | :--- |
| **Frontend Core** | Next.js (App Router) | Version `16.0.7` (React 19.1.0) |
| **Frontend Styling** | Tailwind CSS & Motion | Version `4.x`, Framer Motion / Motion `12.23.12` |
| **State & Auth** | Redux Toolkit & NextAuth.js | Redux Toolkit `2.9.0`, NextAuth.js `4.24.11` |
| **Backend Framework**| Node.js & Express.js | Express `5.1.0` (ES Modules mode) |
| **Database & ODM** | MongoDB & Mongoose | Mongoose `8.18.1` |
| **Payment Gateway** | Square SDK | Official `@square/client` SDK `38.0.0` |
| **Real-time WebSockets**| Socket.IO | Version `4.8.1` (Client & Server) |
| **Notifications** | Nodemailer & Twilio | Hostinger SMTP (`6.9.11`), Twilio Node SDK (`6.0.2`) |
| **Deployment** | Vercel & Coolify | Frontend on Vercel; Backend managed on Coolify (PaaS) |

### Architecture Overview

#### Frontend Architecture
- Built on the Next.js App Router (`frontend/app`).
- Uses Route Groups such as `(home)`, `(auth)`, `(dashboard)`, `(addNewServices)`, alongside dynamic routes (`[slug]`).
- State management uses **Redux Toolkit** (`frontend/store`) for persistent application state and **NextAuth.js** for session management.
- Real-time updates (notifications and live chat) are handled through a custom React context wrapper (`SocketProvider.jsx`).

#### Backend Architecture
- Node.js server powered by Express 5 (`backend/app.js`), organized using the Model-View-Controller (MVC) design pattern:
  - `src/config/`: Database connection logic.
  - `src/controller/`: Business logic for payments, bookings, authentication, user management, services, and locations.
  - `src/models/`: Mongoose schemas.
  - `src/routes/`: Express route definitions.
  - `src/middleware/`: JWT verification and role-based access control.
  - `src/utils/`: Transports for email, SMS, and in-app notifications.
- Express configured with `express.raw({ type: 'application/json' })` specifically for the Square webhook endpoint to verify cryptographic signatures before parsing JSON payloads.

#### Database
- Hosted on MongoDB Atlas / MongoDB instance.
- Mongoose ODM enforces schema structures, relations (`ref: 'User'`, `ref: 'Booking'`), timestamps, and status enums.

#### Deployment Platform
- **Frontend**: Hosted on **Vercel** (`https://hunky-butler.vercel.app` / custom domain `https://www.hunkybutlerservice.co.uk`).
- **Backend**: Managed inside **Coolify** (self-hosted PaaS) running on a Linux VPS, accessible via reverse proxy at `https://api.hunkybutlerservice.co.uk`.

---

## 2. Application Architecture

### System Flow Diagram

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

### Component Connections

1. **Frontend-Backend Integration**: The Next.js frontend sends asynchronous API requests (`fetch` calls) to `NEXT_PUBLIC_BASE_URL` (`https://api.hunkybutlerservice.co.uk/api`).
2. **Database Layer**: Express controllers interact with MongoDB using Mongoose models (`Booking`, `PaymentHistory`, `User`, etc.).
3. **Authentication Flow**: NextAuth handles Google OAuth 2.0 and Credentials login on the frontend. NextAuth issues JWT tokens. Backend routes use `verifyUser` middleware to inspect session tokens.
4. **Booking & Pricing Engine**: Front-end form calculations evaluate postcode distance and staff requirements, sending payload data to `/api/booking` or `/api/payment/create-checkout-session`.
5. **Payment Gateway**: Square Web Payments SDK and Hosted Checkout API generate dynamic checkout links. Completed payments emit webhooks to `/api/webhook`, updating the DB asynchronously.
6. **Notification System**: Triggers email (Nodemailer over Hostinger SMTP) and SMS (Twilio Messaging Service) upon key lifecycle events (Booking Received, Deposit Paid, Balance Paid, Full Payment Confirmed).
7. **Admin Panel**: Provides real-time statistics, butler assignment toggles, payment history verification, and content management (Services, Locations, Reviews, Blogs).
8. **SEO Architecture**: Dynamic rendering via `app/[slug]/page.js`, automated JSON-LD schema generation, and static sitemaps (`app/sitemap.js`, `app/robots.js`).

---

## 3. Booking Flow

### Complete Lifecycle Map

```
  User visits website (/quote)
             │
             ▼
  Fills Event Details (Postcode, Staff, Date, Duration, Service)
             │
             ▼
  System Calculates Price (Base Fee + Distance/Travel Surcharge)
             │
             ▼
  User selects Payment Option (Full Payment vs £20 Deposit)
             │
             ▼
  User submits Booking Form
             │
             ▼
  Backend validates Payload & Creates MongoDB 'Booking' (status: 'ongoing', paid: 'unpaid')
             │
             ▼
  Backend sends "Booking Received - Complete Payment" Email & SMS
             │
             ▼
  Backend calls Square SDK (ordersApi & checkoutApi) -> Generates Square Checkout URL
             │
             ▼
  Frontend redirects User to Square Hosted Checkout Page
             │
             ▼
  User completes Payment (Card / Digital Wallet) on Square
             │
             ▼
  Square sends HTTP POST Webhook to Backend (/api/webhook)
             │
             ▼
  Backend raw middleware verifies HMAC SHA-256 Signature (x-square-hmac-sha256)
             │
             ▼
  Backend verifies Payment Status ('COMPLETED') & checks Idempotency in PaymentHistory DB
             │
             ▼
  MongoDB Updated: Booking paymentStatus -> 'FULLY_PAID' or 'DEPOSIT_PAID'
                   New PaymentHistory record saved with transaction ID
             │
             ▼
  Backend sends "Payment Confirmed / Deposit Received" Email & SMS to Customer & Admin
             │
             ▼
  Customer redirected to /booking/success?session_id=...
```

### Detailed Step-by-Step Explanation

1. **Quote Request & Calculation**: The customer completes `FirstStep` (contact & location info) and `SecondStep` (date, staff count, duration, service selection). The frontend invokes `calculatePrice()` which computes the base service fee plus a travel surcharge derived from postcode distance.
2. **Booking Pre-Save**: Upon submitting the form, the frontend initiates a request to the backend. The backend constructs a `Booking` document in MongoDB with default status `paymentStatus: 'pending'` and `paid: 'unpaid'`.
3. **Immediate Notification**: As soon as the booking is saved, the backend immediately fires an automated transactional email and SMS informing the user that their booking request was received and prompting them to complete payment.
4. **Checkout Session Creation**: The backend calls Square’s `checkoutApi.createPaymentLink()`. A line item is attached containing the service name, charge amount (either the full price or £20 deposit), and the MongoDB `booking._id` embedded inside the line item note and reference ID.
5. **Redirection to Gateway**: The backend returns the `checkoutUrl` to the frontend, which redirects the user's browser directly to Square's secure hosted payment page.
6. **Payment Processing**: The customer enters card details or uses Apple Pay / Google Pay. Square processes the charge.
7. **Webhook Dispatch & Cryptographic Verification**: Square sends an HTTP POST event payload to `https://api.hunkybutlerservice.co.uk/api/webhook`. Express intercepts the request as a raw buffer, computes the HMAC-SHA256 digest using `SQUARE_WEBHOOK_SIGNATURE_KEY`, and compares it with the `x-square-hmac-sha256` header.
8. **Idempotent Database Update**: The controller checks `PaymentHistory` for the `squarePaymentId`. If missing (first time event), it updates the `Booking` collection (`paymentStatus: 'FULLY_PAID'` or `'DEPOSIT_PAID'`, `paid: 'paid'`), creates a new `PaymentHistory` record, and increments the customer's service count.
9. **Final Confirmation**: Automated confirmation emails and SMS messages containing receipt details, remaining balance warnings (if deposit option was chosen), and dashboard access links are sent to the customer and admin.

---

## 4. Square Payment Integration

### SDK & Client Initialization
- **SDK Package**: Official `@square/client` (version `38.0.0`).
- **Initialization Location**: Defined at top-level scope in `backend/src/controller/payment.controller.js`.

```javascript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client, Environment } = require('square');

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: (process.env.SQUARE_ENVIRONMENT === 'sandbox' || process.env.SQUARE_APPLICATION_ID?.startsWith('sandbox-'))
    ? Environment.Sandbox 
    : Environment.Production
});

const { paymentsApi, ordersApi, checkoutApi } = squareClient;
```

### Controller Responsibilities
The file `backend/src/controller/payment.controller.js` contains all logic for payment generation, webhook consumption, idempotency checks, and database synchronization:

- `createCheckoutSession`: Creates a new booking in MongoDB, prepares line items with amount in cents (`Math.round(amount * 100)`), calls Square `ordersApi.createOrder()` and `checkoutApi.createPaymentLink()`, and returns the `checkoutUrl`.
- `createCheckoutSessionExistngBooking`: Handles payment link generation for existing bookings (e.g. paying the remaining balance or re-attempting a deposit payment from the customer dashboard).
- `handleSquareWebhook`: Raw webhook handler registered at `app.post('/api/webhook', express.raw({ type: 'application/json' }), handleSquareWebhook)`. Validates HMAC SHA-256 signatures and processes `payment.updated` events.
- `handleSuccessfulPayment`: Inner utility function that retrieves order/booking references, enforces idempotency, updates `Booking` and `PaymentHistory` collections, and triggers confirmation notifications.
- `mockPaySuccess`: Testing helper endpoint that simulates successful checkout when Square credentials are configured as placeholders.

### Payment Modes: Deposit vs Full Payment
- **Deposit Payment (£20)**: Sets `depositAmount: 20`, calculates `amountDue: price - 20`, and sets `paymentStatus: 'DEPOSIT_PAID'`. The customer is notified that the date is secured but the remaining balance is due prior to the event.
- **Full Payment**: Charges the total price upfront, sets `depositAmount: 0`, `amountDue: 0`, and updates `paymentStatus: 'FULLY_PAID'` and `paid: 'paid'`.

### Webhook Verification & Idempotency
1. **Signature Verification**:
   ```javascript
   const signature = req.headers['x-square-hmac-sha256'];
   const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

   if (webhookSignatureKey && signature) {
     const hmac = crypto.createHmac('sha256', webhookSignatureKey);
     hmac.update(req.body.toString());
     const hash = hmac.digest('base64');
     if (hash !== signature) {
       return res.status(401).send('Unauthorized');
     }
   }
   ```
2. **Duplicate Event Prevention**:
   ```javascript
   const existingPayment = await PaymentHistory.findOne({ squarePaymentId: payment.id });
   if (existingPayment) {
     console.log(`⚠️ Webhook duplicate: Payment ${payment.id} already processed. Skipping.`);
     return { success: true, bookingId, paymentHistoryId: existingPayment._id.toString() };
   }
   ```

### Webhook Event Requirements
- **Required Subscription Event**: `payment.updated`
- **Backend Endpoint URL**: `https://api.hunkybutlerservice.co.uk/api/webhook`

### Current Assumptions & Placeholder Fallback
- The controller checks if `process.env.SQUARE_ACCESS_TOKEN` is missing or contains placeholder values (e.g., `'your_sandbox_access_token'`).
- If placeholder credentials are detected, the system logs a warning and generates a **mock checkout link** (`/api/payment/mock-pay-success`) allowing testing of the booking lifecycle without active Square keys.

---

## 5. Required Environment Variables

Below is the complete list of environment variables used across the backend and frontend codebases.

### Environment Variables Table

| Variable Name | Purpose | Required? | Layer | Example / Placeholder Value |
| :--- | :--- | :--- | :--- | :--- |
| `MONGODB_URI` / `MONGO_URI` | MongoDB connection string | **Yes** | Backend | `mongodb+srv://user:pass@cluster.mongodb.net/hunkybutler` |
| `PORT` | Node server listener port | No (Default: 5000) | Backend | `5000` |
| `NODE_ENV` | Mode (`development` / `production`) | No (Default: development) | Backend | `production` |
| `SQUARE_ACCESS_TOKEN` | Square OAuth / Secret Access Token | **Yes** | Backend | `EAAAEO...` (Production) / `EAAl...` (Sandbox) |
| `SQUARE_APPLICATION_ID` | Square App ID | **Yes** | Backend | `sq0idp-...` (Production) / `sandbox-sq0idp-...` |
| `SQUARE_LOCATION_ID` | Square Location ID | **Yes** | Backend | `L...` (Location ID from Square Dashboard) |
| `SQUARE_ENVIRONMENT` | Gateway mode (`sandbox` / `production`) | **Yes** | Backend | `production` or `sandbox` |
| `SQUARE_CURRENCY` | Transaction currency ISO code | No (Default: GBP) | Backend | `GBP` |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | HMAC SHA256 Webhook Verification Key | **Yes** | Backend | `sig_key_...` (From Square Webhook Settings) |
| `FRONTEND_URL` | Frontend origin URL for CORS & redirects | **Yes** | Backend | `https://www.hunkybutlerservice.co.uk` |
| `ADMIN_EMAIL` | Target email for admin booking alerts | No (Default fallback set) | Backend | `booking@hunkybutlerservice.co.uk` |
| `SMTP_HOST` | Hostinger Mail / SMTP server host | **Yes** | Backend | `smtp.hostinger.com` |
| `SMTP_PORT` | SMTP port number | **Yes** | Backend | `587` (or `465`) |
| `SMTP_SECURE` | Use SSL/TLS (`true` or `false`) | **Yes** | Backend | `false` (for port 587) / `true` (for 465) |
| `SMTP_USER` | SMTP login username / Sender address | **Yes** | Backend | `booking@hunkybutlerservice.co.uk` |
| `SMTP_PASS` | SMTP mailbox password | **Yes** | Backend | `[PLACEHOLDER_MAILBOX_PASSWORD]` |
| `SMTP_FROM` | Sender display string | **Yes** | Backend | `"Hunky Butler Service <booking@hunkybutlerservice.co.uk>"` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID for SMS notifications | Optional | Backend | `AC...` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token for SMS notifications | Optional | Backend | `auth_token_...` |
| `TWILIO_SID` | Twilio Messaging Service SID | Optional | Backend | `MG...` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth JWT token encryption | **Yes** | Both | `super_secret_jwt_key_here` |
| `NEXTAUTH_URL` | Canonical public URL of Next.js app | **Yes** | Frontend | `https://www.hunkybutlerservice.co.uk` |
| `GOOGLE_CLIENT_ID` | Google OAuth App Client ID | Optional | Frontend | `12345678-xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth App Client Secret | Optional | Frontend | `GOCSPX-xxx` |
| `GOOGLE_API_KEY` | Google Places API key for reviews | Optional | Frontend | `AIzaSy...` |
| `NEXT_PUBLIC_BASE_URL` | Public API base URL for client fetch calls | **Yes** | Frontend | `https://api.hunkybutlerservice.co.uk/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Public Socket.IO WebSocket server URL | **Yes** | Frontend | `https://api.hunkybutlerservice.co.uk` |

---

## 6. Deployment Guide

### Backend Deployment Architecture (Coolify / VPS)
1. **Source Code**: The backend repository is linked to Coolify via GitHub integration or Git Webhook.
2. **Build Configuration**:
   - Runtime: Node.js (ES Modules mode, `package.json` contains `"type": "module"`).
   - Build Command: None required (interpreted Node.js).
   - Start Command: `npm run dev` or `node server.js`.
3. **Port & Reverse Proxy**:
   - The backend listens on `process.env.PORT || 5000` bound to address `0.0.0.0`.
   - Coolify's built-in Traefik reverse proxy terminates SSL and routes incoming HTTPS traffic to `api.hunkybutlerservice.co.uk` -> Port `5000`.
4. **Environment Variables**:
   - Variables are configured in the Coolify UI and injected into the runtime environment on container boot.
5. **Database Connectivity**:
   - Upon container boot, `app.js` invokes `await connectDB()`, connecting to MongoDB using `process.env.MONGODB_URI`.

### Frontend Deployment Architecture (Vercel)
1. **Source Code**: Connected to Vercel via GitHub repo integration.
2. **Build Configuration**:
   - Framework Preset: Next.js.
   - Build Command: `next build --turbopack`.
   - Output Directory: `.next`.
3. **Environment Injection**:
   - `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_SOCKET_URL` must be defined in Vercel Project Settings for client-side bundle compilation.

---

## 7. Coolify Setup

This section outlines how the backend application is configured and maintained within the Coolify PaaS manager.

```
Coolify Dashboard
 └── Projects
      └── Hunky Butler Project
           └── Production Environment
                └── Backend Service (api.hunkybutlerservice.co.uk)
                     ├── Configuration Tab (Build / Deployment settings)
                     ├── Environment Variables Tab (Keys & Secrets)
                     ├── Logs Tab (Runtime inspection)
                     └── Webhooks / Git Integration
```

### Navigating & Managing Environment Variables in Coolify

1. **Accessing Variables**:
   - Log into the Coolify Dashboard instance.
   - Navigate to **Projects** -> **Hunky Butler** -> **Production** -> Select **Backend Service**.
   - Click on the **Environment Variables** tab in the top sub-navigation bar.

2. **Adding a New Variable**:
   - Click **+ Add Variable** / **New Variable**.
   - Enter the **Key** (e.g. `SQUARE_WEBHOOK_SIGNATURE_KEY`).
   - Enter the **Value** (e.g. `sq0wbidx-...`).
   - Enable **Is Secret** if the variable contains sensitive credentials.
   - Click **Save**.

3. **Updating Existing Variables**:
   - Locate the target key in the list.
   - Update the text field with the new value.
   - Click **Save changes**.

4. **When to Restart vs. When to Rebuild**:
   - **Restart Sufficient**: Updating environment variables, credentials (SMTP, Square keys), or database URIs only requires a **Container Restart**. Click **Restart** in the top-right corner of the Coolify dashboard.
   - **Rebuild Required**: Pushing new code changes to GitHub, updating `package.json` dependencies, or altering runtime configs requires a **Full Rebuild**. Click **Redeploy / Rebuild** in Coolify.

---

## 8. MongoDB Database

### Collections Schema Summary

#### 1. `bookings` Collection (`Booking` model)
Stores all service quotes and customer bookings.
- **Fields**: `firstName`, `lastName`, `email`, `phone`, `postCode`, `dateOfEvent`, `numberOfStaff`, `startTime`, `durationHours`, `serviceName`, `price`, `status` (`'completed'`, `'ongoing'`, `'cancel'`, `'cancelled'`, `'accepted'`), `paymentType` (`'full'`, `'deposit'`), `squarePaymentId`, `squareOrderId`, `receiptUrl`, `butler` (array of `{ id: ref User, accepted: Boolean }`), `location`, `paid` (`'paid'`, `'unpaid'`), `amountPaid`, `paymentStatus` (`'pending'`, `'DEPOSIT_PAID'`, `'FULLY_PAID'`, `'failed'`), `depositAmount`, `amountDue`, `remainingBalance`, `totalAmount`, `profit`.

#### 2. `paymenthistories` Collection (`PaymentHistory` model)
Provides an immutable financial audit log of all transactions.
- **Fields**: `bookingId` (`ref Booking`), `customerEmail`, `serviceName`, `totalAmount`, `paymentType`, `depositAmount`, `amountDue`, `remainingBalance`, `amountPaid`, `currency`, `butler` (array), `paymentMethodType`, `paymentMethod`, `paymentStatus`, `squarePaymentId`, `squareOrderId`, `receiptUrl`, `paidAt`, `paymentConfirmedAt`, `customerName`, `customerPhone`, `serviceTime`, `serviceDuration`, `serviceLocation`, `numberOfStaff`, `notes`, `isActive`, `adminVerified`.

#### 3. `users` Collection (`User` model)
Stores customer, butler, and administrator account data.
- **Fields**: `email` (unique), `password` (hashed), `role` (`'customer'`, `'butler'`, `'admin'`), `isVerified`, `authProvider` (`'credentials'`, `'google'`, `'apple'`), `name`, `firstName`, `lastName`, `phone`, `location`, `postcode`, `bio`, `profileImage`, `isButler` (`'none'`, `'active'`, `'pending'`, `'reject'`, `'suspend'`), `averageRating`, `totalReviews`, `serviceTaken` (counter), `isOnline`, `lastActive`.

#### 4. `services` Collection (`Service` model)
Defines service types, hourly rates, and staff modifiers.

#### 5. `locations` Collection (`Location` model)
Defines supported coverage areas and regional pricing parameters.

#### 6. `ordermappings` Collection (`OrderMapping` model)
Maintains fallback mapping between Square Order IDs (`squareOrderId`), `bookingId`, and `customerEmail`.

#### 7. Additional Collections
- `reviews`: Stores customer feedback and star ratings linked to services/butlers.
- `blogs`: Stores articles, tags, slugs, and rich text for SEO marketing.
- `messages`: Real-time chat log between users (`senderId`, `receiverId`, `message`, `timestamp`).
- `notifications`: In-app alert queue for user dashboards.
- `otps`: One-Time Passwords for verification with expiration timestamps.

---

## 9. API Overview

### Key Endpoint Directory

| Endpoint | Method | Authentication | Purpose | Used By (Frontend Page) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Account registration | `/register`, `/login` |
| `/api/auth/login` | `POST` | Public | User authentication & login | `/login` |
| `/api/auth/forget-password` | `POST` | Public | Initiates password reset via OTP | `/forget-password` |
| `/api/auth/change-password` | `POST` | Protected | Changes account password | Dashboard Profile |
| `/api/booking` | `POST` | Public | Creates a new booking & sends alerts | `/quote` Step 2 |
| `/api/booking` | `GET` | Protected | Fetches paginated bookings | Admin Dashboard |
| `/api/booking/customer/:email`| `GET` | Protected | Fetches customer booking history | Customer Dashboard |
| `/api/booking/butler/:id` | `GET` | Protected | Fetches assigned butler bookings | Butler Dashboard |
| `/api/booking/status` | `PUT` | Protected | Updates status & butler assignments | Admin / Butler Dashboard |
| `/api/payment/create-checkout-session` | `POST` | Public | Generates Square checkout link (new booking) | `/quote` Step 2 |
| `/api/payment/create-checkout-session-exist` | `POST` | Public | Generates Square link for balance/existing booking | Customer Dashboard |
| `/api/webhook` | `POST` | Signature Verified | Consumes Square payment events | External Square Gateway |
| `/api/payment/allPayments` | `GET` | Protected | Returns financial audit logs | Admin Payment History |
| `/api/user/customer` | `GET` | Protected | Lists customers with pagination | Admin User List |
| `/api/user/butlers` | `GET` | Protected | Lists butler profiles | Admin Butler Management |
| `/api/service` | `GET`/`POST` | Public / Admin | Services CRUD operations | Homepage, Admin Services |
| `/api/locations` | `GET`/`POST` | Public / Admin | Supported cities & pricing factors | Locations section, Admin |

---

## 10. SEO Overview

### Current SEO Architecture
1. **Dynamic Route Generation (`app/[slug]/page.js`)**:
   - Generates static pages for UK city locations (`generateStaticParams`) powered by `app/locations/locations.json`.
   - Automatically populates metadata titles, meta descriptions, canonical URLs (`https://www.hunkybutlerservice.co.uk/[slug]`), OpenGraph tags, and Twitter Cards.

2. **Structured Data (JSON-LD)**:
   - Site-wide `EntertainmentBusiness` schema injected in `app/(home)/layout.js`.
   - City-level `LocalBusiness` schema and `BreadcrumbList` schema dynamically injected into location landing pages.
   - City-specific `FAQPage` schema rendered where city FAQs exist.

3. **301 Redirect Matrix (`next.config.mjs`)**:
   - Retains authority from legacy WordPress permalinks by mapping old category/page URLs (e.g. `/category/buff-butlers`, `/index.php/work-for-us`) to their modern Next.js equivalents (`/buff-butlers`, `/joinTheTeam`).

4. **Duplicate Content Protection**:
   - Location pages default to `robots: { index: false, follow: true }` until specific city entries in `locations.json` receive unique copy (`uniqueContent: true`). This protects the domain from Google duplicate content penalties.

---

## 11. Current Status

### Completed Features
- Full instant quote calculator with postcode travel fee evaluation.
- Complete Square Hosted Checkout integration supporting **Full Payment** and **£20 Deposit** options.
- Square Webhook handler with cryptographic HMAC-SHA256 signature verification.
- Mock payment checkout fallback for local development or placeholder configuration.
- Dual-channel transactional notifications (HTML Email over Hostinger SMTP + SMS via Twilio).
- Customer, Butler, and Admin dashboard views.
- Real-time Socket.IO chat messaging and in-app alerts.
- Modern location landing page architecture with JSON-LD schema generation and 301 legacy redirects.

### Features Currently Waiting for Client Input
- Production Square API Credentials (Access Token, Location ID, Webhook Signature Key).
- Final verification of production SMTP mailbox credentials (`booking@hunkybutlerservice.co.uk`).
- Twilio SMS Account SID, Auth Token, and Messaging Service SID activation.

### Known Limitations & Security Observations

> [!WARNING]
> **Permissive Auth Middleware**: The file `backend/src/middleware/privateRoute.js` is currently operating in **permissive mode** (bypassing strict JWT role verification if tokens are missing during testing). This must be tightened prior to full public launch.

> [!NOTE]
> **Legacy Code Cleanup**: The file `backend/src/controller/paymentControllerBackup.js` contains archived Stripe integration code. The active payment flow relies strictly on `payment.controller.js`.

---

## 12. Client Requirements

**Information Required From Client**

The following production configuration details must be provided by the client prior to final deployment:

- [ ] **Square Production Credentials**:
  - `SQUARE_ACCESS_TOKEN` (Live Access Token from Square Developer Dashboard)
  - `SQUARE_APPLICATION_ID` (Live Application ID, starting with `sq0idp-`)
  - `SQUARE_LOCATION_ID` (Live Location ID)
  - `SQUARE_WEBHOOK_SIGNATURE_KEY` (Generated when adding the webhook endpoint in Square Dashboard)
- [ ] **Square Webhook Configuration**:
  - Webhook Target URL set to: `https://api.hunkybutlerservice.co.uk/api/webhook`
  - Subscribed event: `payment.updated`
- [ ] **Email Credentials (Hostinger SMTP)**:
  - Mailbox Password for `booking@hunkybutlerservice.co.uk`
- [ ] **Twilio SMS Credentials** (If SMS notifications are desired):
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_SID` (Messaging Service SID)
- [ ] **Google API Keys** (If Google Login / Google Reviews are actively used):
  - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_API_KEY`

---

## 13. Recommendations

### 1. Security & Authentication
- **Enforce JWT Middleware**: Re-enable strict token checking in `backend/src/middleware/privateRoute.js` so that unauthenticated requests cannot access protected customer or admin routes.
- **Mandatory Webhook Signature Check**: Reject incoming webhooks unconditionally if `SQUARE_WEBHOOK_SIGNATURE_KEY` fails signature verification.

### 2. Payment Reliability & Accounting
- **Balance Payment Automation**: Implement an automated cron job or email reminder 7 days prior to an event for bookings with status `DEPOSIT_PAID` to request the remaining balance.

### 3. SEO & Content Expansion
- **Unique City Content**: Systematically update entries in `frontend/app/locations/locations.json` with unique local copy and set `"uniqueContent": true` to index city landing pages across all UK target markets.

### 4. Codebase Maintenance
- **Remove Legacy Archives**: Remove archived files (`paymentControllerBackup.js`, `SecondStepBakcup2.jsx`) to keep the repository clean and avoid developer confusion.

---
*Document prepared for client review and technical handover.*
