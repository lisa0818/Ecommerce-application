# Verdant — Full-Stack E-Commerce App

React + TailwindCSS frontend, Node/Express backend, MongoDB via Mongoose, JWT auth.

## Project structure

```
ecommerce-app/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # Product, User, Order (Mongoose schemas)
│   ├── routes/                 # auth, products, cart, orders
│   ├── middleware/auth.js      # JWT verification
│   ├── seed/seedProducts.js    # sample product data
│   ├── server.js               # Express app entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api/api.js          # axios instance, attaches JWT
    │   ├── context/            # AuthContext, CartContext
    │   ├── components/         # Navbar, ProductCard, SearchBar
    │   ├── pages/               # Home, Cart, Checkout, Login, Register
    │   ├── App.jsx
    │   └── index.js
    ├── tailwind.config.js
    ├── .env.example
    └── package.json
```

## Prerequisites

- Node.js 18+ and npm — check with `node -v` and `npm -v`
- MongoDB — either installed locally, or a free MongoDB Atlas cloud cluster (instructions below)
- Git (optional, only if you clone this into version control)

---

## Step 1 — Set up MongoDB

You have two options. Pick **either** A (local) or B (cloud, no install required).

### Option A: Local MongoDB install

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Windows:**
1. Download the MongoDB Community Server installer from https://www.mongodb.com/try/download/community
2. Run the installer, keep "Install MongoDB as a Service" checked.
3. MongoDB will start automatically as a Windows service on `localhost:27017`.

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Verify it's running:**
```bash
mongosh
# should open a MongoDB shell connected to mongodb://127.0.0.1:27017
```

Your connection string will be:
```
mongodb://127.0.0.1:27017/ecommerce
```

### Option B: MongoDB Atlas (free cloud database, no local install)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **free (M0) cluster** — pick any cloud provider/region.
3. Under **Database Access**, create a database user with a username and password (save these).
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0) for local development.
5. Once the cluster is deployed, click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the credentials from step 3, and add a database name before the `?`, e.g.:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

Keep this string handy — you'll paste it into `backend/.env` in Step 2.

---

## Step 2 — Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and set:
```
MONGO_URI=<your connection string from Step 1>
JWT_SECRET=<any long random string, e.g. run `openssl rand -hex 32`>
PORT=5000
```

Seed the database with sample products:
```bash
npm run seed
```
You should see `Inserted 10 sample products.` in the console.

Start the backend server:
```bash
npm run dev
```
(`npm run dev` uses nodemon and auto-restarts on file changes. Use `npm start` for a plain run.)

You should see:
```
MongoDB connected: 127.0.0.1/ecommerce
Server running on http://localhost:5000
```

Confirm it's alive by visiting http://localhost:5000/api/health in a browser — you should see `{"status":"ok"}`.

---

## Step 3 — Frontend setup

Open a **new terminal** (leave the backend running in the first one):

```bash
cd frontend
npm install
cp .env.example .env
```

The default `.env` points to `http://localhost:5000/api`, which matches the backend from Step 2 — no changes needed unless you changed the backend `PORT`.

Start the frontend:
```bash
npm start
```

This opens http://localhost:3000 in your browser automatically. You should see the product catalog loaded from your MongoDB database.

---

## Step 4 — Try it out

1. **Browse & search** — use the search bar and category dropdown on the home page.
2. **Register an account** — click "Sign up" and create a user (stored, password-hashed, in MongoDB).
3. **Add to cart** — click "Add to cart" on any product. If you're logged in, the cart is saved to your account in MongoDB and will persist across browser sessions/devices. If you're a guest, it's saved to `localStorage` in your browser.
4. **Checkout** — go to Cart → Proceed to checkout, fill in a shipping address and any card-number-shaped digits (13–19 digits), and submit. This simulates a payment (no real charge, no real card processor) and creates an `Order` document in MongoDB.

---

## API reference

| Method | Route | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create a new user, returns JWT |
| POST | `/api/auth/login` | No | Log in, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/products` | No | List products, supports `?search=` and `?category=` |
| GET | `/api/products/categories` | No | Distinct list of categories |
| GET | `/api/products/:id` | No | Single product |
| POST | `/api/products` | No | Create a product (admin/seed use) |
| GET | `/api/cart` | Yes | Get current user's cart |
| POST | `/api/cart` | Yes | Add item `{ productId, quantity }` |
| PUT | `/api/cart/:productId` | Yes | Update quantity `{ quantity }` |
| DELETE | `/api/cart/:productId` | Yes | Remove one item |
| DELETE | `/api/cart` | Yes | Clear the cart |
| POST | `/api/orders/checkout` | Yes | Simulate payment, create order, empty cart |
| GET | `/api/orders` | Yes | List current user's past orders |
| GET | `/api/orders/:id` | Yes | Single order |

All authenticated routes expect header: `Authorization: Bearer <token>`.

---

## Database schema summary

- **Product**: `name, description, price, category, image, stock, timestamps`
- **User**: `name, email (unique), password (bcrypt-hashed), cart: [{ product, quantity }], timestamps`
- **Order**: `user, items: [{ product, name, price, quantity }], shippingAddress, paymentMethod, itemsTotal, shippingFee, tax, totalPrice, status (pending|paid|failed), paidAt, timestamps`

---

## Notes on the "payment simulation"

No real payment gateway (Stripe, PayPal, etc.) is integrated. The checkout endpoint validates that the card number is 13–19 digits, then marks the order `paid` and clears the cart — this is purely for demoing a full checkout flow end to end. To go to production, swap the simulated logic in `backend/routes/orders.js` for a real provider's server-side SDK (e.g. Stripe PaymentIntents), and never send raw card numbers to your own server — use the provider's client-side tokenization instead.

## Deployment notes

- **Backend**: deployable as-is to Render, Railway, Fly.io, or a VM. Set `MONGO_URI`, `JWT_SECRET`, `PORT` as environment variables in your host's dashboard — do not commit `.env`.
- **Frontend**: run `npm run build` inside `frontend/` to produce a static `build/` folder, deployable to Vercel, Netlify, or any static host. Set `REACT_APP_API_URL` to your deployed backend's URL.
- **Database**: MongoDB Atlas (Option B above) is the easiest production-ready choice — it's already cloud-hosted.
- Update CORS in `backend/server.js` (`app.use(cors())`) to restrict `origin` to your deployed frontend domain instead of allowing all origins, once you're live.
