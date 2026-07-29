# Expensso 💰

**Your ultimate budget partner — got it all**

Expensso is a full-stack personal finance tracker that helps you log transactions, set category budgets, spot spending trends, and get rule-based savings recommendations — all wrapped in a clean, animated dashboard with dark/light mode.

🔗 **Live App:** [expensso-theta.vercel.app](https://expensso-theta.vercel.app)
🔗 **Backend API:** [expensso-your-budget-partner.onrender.com](https://expensso-your-budget-partner.onrender.com)

> ⚠️ The backend is hosted on Render's free tier, so it may take ~30–50 seconds to "wake up" on the first request after inactivity.

---

## ✨ Features

- **Landing page** with an animated 3D hero scene (floating credit card, rotating coins, animated chart) built with Three.js
- **Auth** — JWT-based signup/login with protected routes
- **Dashboard** — balance/income/expense summary cards, quick-add transaction form, expense/income pie chart, recent transactions
- **Transactions** — searchable, filterable full transaction history (by category, note, or type)
- **Budgets** — set monthly limits per category with color-coded progress bars and over-budget warnings
- **Analytics** — month-over-month comparison, top spending category, average daily spend, 6-month income vs. expense bar chart
- **Notifications** — bell + toast system distinguishing essential vs. discretionary alerts, with rule-based personalized recommendations (e.g. suggested budgets, savings-rate insights) and one-click "Apply this budget"
- **Recurring transactions** — automatic backfill and cascade handling
- **Settings** — profile editing, password change, CSV export, dark/light theme toggle, account deletion
- **Fully responsive** — collapses to a bottom nav / top bar on mobile

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS v4
- Framer Motion (animations)
- Three.js + @react-three/fiber + @react-three/drei (3D hero graphics)
- Recharts (charts)
- lucide-react (icons)
- react-router-dom
- axios

**Backend**
- Node.js + Express
- MongoDB Atlas (Mongoose)
- JWT authentication
- bcryptjs (password hashing)

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 📁 Folder Structure

```
Expensso/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/axios.js
│       ├── context/        # Auth, Theme, Notification contexts
│       ├── components/     # Sidebar, Layout, TransactionForm, ExpenseChart, HeroScene, etc.
│       ├── pages/           # Landing, Login, Signup, Dashboard, Transactions, Budget, Analytics, Settings
│       └── App.jsx
└── server/                  # Express backend
    ├── config/db.js
    ├── models/              # User, Transaction, Budget, Notification, RecurringTransaction
    ├── controllers/
    ├── routes/
    ├── middleware/authMiddleware.js
    └── server.js
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/MalaikaIrfan1/Expensso.git
cd Expensso
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Run the backend:
```bash
node server.js
```

### 3. Frontend setup
Open a new terminal:
```bash
cd client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

---

## 📡 API Endpoints

**Auth** — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/login` | Log in, returns JWT |
| PUT | `/profile` | Update profile |
| PUT | `/password` | Change password |
| DELETE | `/account` | Delete account |

**Transactions** — `/api/transactions`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all transactions |
| POST | `/` | Create a transaction |
| DELETE | `/:id` | Delete a transaction |
| GET | `/summary/all` | Category-wise summary (filterable by `type=income\|expense`) |
| GET | `/monthly-comparison` | Income vs. expense, last 6 months |
| GET | `/export/csv` | Export transactions as CSV |

**Budgets** — `/api/budgets`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all budgets |
| POST | `/` | Create/update a budget |
| DELETE | `/:id` | Delete a budget |

**Recurring Transactions** — `/api/recurring`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get recurring rules |
| POST | `/` | Create a recurring transaction |
| DELETE | `/:id` | Delete (with cascade handling) |

**Notifications** — `/api/notifications`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get notifications |
| PUT | `/:id/read` | Mark as read |

> All endpoints except `/auth/signup` and `/auth/login` require a `Authorization: Bearer <token>` header.

---

## 🔒 Security Notes

- Passwords are hashed with bcryptjs before storage
- JWT tokens are used for route protection
- `.env` files are excluded from version control via `.gitignore`

---

## 📄 License

This project was built for educational/portfolio purposes.