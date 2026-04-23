# 🚀 Smart Inventory + Demand Forecasting System

A **AI-powered inventory management system** built for small businesses and shops to **prevent overstocking, reduce stockouts, and improve decision-making**.

---

# 🧠 Problem Statement

Small businesses often face:

* ❌ Overstocking → leads to waste and capital lock
* ❌ Stockouts → lost sales and unhappy customers
* ❌ No demand prediction → purely manual decisions
* ❌ No analytics → no visibility into profit, trends, or performance

---

# 💡 Solution

This system provides:

* 📦 Full inventory management (CRUD)
* 🤖 AI-powered insights & recommendations
* 📊 Analytics dashboard (profit, trends, stock behavior)
* 🔄 Real-world supply chain workflow (Admin ↔ Supplier)
* 🛒 Customer-facing shop experience

---

# 🏗️ Tech Stack

### Frontend + Backend

* Next.js 16 (App Router)
* TypeScript
* Tailwind CSS

### UI

* ShadCN UI (Radix-based components)

### Backend

* API Routes (Next.js server functions)

### Database

* MongoDB + Mongoose

### Authentication

* NextAuth.js (JWT strategy)

### AI Integration

* Groq API (Llama 3.3 70B Versatile)

---

# 🔐 Authentication & Authorization

### Roles in the System:

| Role     | Description                              |
| -------- | ---------------------------------------- |
| Admin    | Business owner (full control)            |
| Supplier | Handles restocking & product suggestions |
| User     | Customer (buys products)                 |

---

## 🧑‍💼 Admin Permissions

* ✅ Full CRUD (Products, Orders)
* ✅ View analytics dashboard
* ✅ AI insights & business advisor
* ✅ Request stock (cannot directly modify stock)
* ✅ Approve supplier product suggestions
* ✅ View all users & system data

---

## 👨‍🏭 Supplier Permissions

* ✅ View all products
* ✅ View low-stock products
* ✅ Approve restock requests
* ✅ Suggest new products
* ❌ Cannot access analytics dashboard
* ❌ Cannot directly modify product data

---

## 🛒 User Permissions

* ✅ View available products
* ✅ Buy products
* ✅ Get notified when out-of-stock items return (Email integration in version 2)
* ✅ Receive AI recommendations
* ❌ No access to analytics or backend controls

---

# 🔄 Core Features

---

## 📦 Product Management

* Create, update, delete products
* Track stock, price, SKU, threshold

---

## 🧾 Order System

Two types:

* `sale` → customer purchase
* `purchase` → stock acquisition (via supplier flow)

Includes:

* user tracking (`userId`)
* stock validation
* stockout detection

---

## 🔄 Restock Workflow (Key Feature)

### Flow:

1. Admin requests stock
2. Supplier reviews request
3. Supplier approves → stock increases

👉 Admin **cannot directly change stock** (Version 2 implementation).
For easiness admin can increase stock.

---

## 🧠 AI Features

---

### 1. AI Insights (Per Product)

* Demand trends
* Stock movement analysis
* AI-generated explanations

---

### 2. AI Business Advisor

* Smart suggestions for inventory decisions
* Detects:

  * slow-moving items
  * high-demand products
  * risk of stockout

---

### 3. AI User Recommendations

* Based on:

  * purchase history
  * trending products
  * availability
  * seasonality

---

## 🔔 Notification System

* Users can subscribe to out-of-stock products
* Notified when product becomes available
* Note : Email Integration is still pending : Will be done in version 2

---

## 📊 Analytics Dashboard

Includes:

* 📈 Demand trends
* 💰 Profit insights (sample right now not actual : actual will be done when we have enough data to work with)
* 🧊 Fast / slow / dead stock classification
* 📉 Stockout loss tracking

---

## 🏪 User Shop Experience

* Clean product listing
* Buy button (only if in stock)
* Notify option (if out of stock)
* Personalized recommendations

---

# 🧱 Project Structure

```
app/
 ├── api/
 │   ├── products/
 │   ├── orders/
 │   ├── restock/
 │   ├── insights/
 │   ├── ai/
 │   └── auth/
 ├── dashboard/
 ├── shop/
 ├── supplier/
 ├── admin/

models/
 ├── Product.ts
 ├── Order.ts
 ├── User.ts
 ├── RestockRequest.ts
 ├── ProductSuggestion.ts
 ├── Notification.ts

lib/
 ├── db.ts
 ├── auth.ts

types/
 ├── next-auth.d.ts
```

---

# ⚙️ Environment Variables

Create `.env.local`

```env
MONGODB_URI=your_mongodb_connection
NEXTAUTH_SECRET=your_secret
GROQ_API_KEY=your_groq_api_key
```

---

# 🛠️ Run Locally

---

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Setup Environment Variables

Create `.env.local` and add values

---

## 4. Run Development Server

```bash
npm run dev
```

---

## 5. Open in Browser

```
http://localhost:3000
```

---

# 🚀 Deployment

```
https://smart-inventory-management-six.vercel.app/
```

# 🔐 Security Considerations

* Role-based access control (RBAC)
* Input validation using Zod
* Password hashing (bcrypt)
* Protected API routes
* JWT session management

---

# 📈 Advanced Concepts Used

* Server-side rendering (SSR)
* API route architecture
* MongoDB aggregation (analytics)
* AI integration in real workflows
* Scalable modular structure

---


# 🧪 Testing

Use:

* Postman

Test endpoints:

* `/api/products`
* `/api/orders`
* `/api/restock`
* `/api/ai/*`

---

# ⚠️ Known Limitations

* Notification system is basic (no email/SMS yet)
* AI recommendations depend on available data
* No payment integration (can be added)
* Product price is not taken into consideration.

---

# 🚀 Future Improvements

* Email/SMS notifications
* Payment gateway integration
* Real-time updates (WebSockets)
* Advanced forecasting models
* Supplier performance tracking
* Price addition