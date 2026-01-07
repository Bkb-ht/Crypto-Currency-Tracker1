# CryptoTrack – Cryptocurrency Tracking & Portfolio Management

CryptoTrack is a modern, responsive full-stack web application that allows users to view real-time cryptocurrency market data, manage their crypto portfolio, and visualize profit/loss using interactive dashboards.

## 🚀 Features

- **Authentication**: Secure JWT-based registration and login.
- **Market Dashboard**: Real-time prices, 24h changes, and market cap for top 50 coins (via CoinGecko).
- **Portfolio Management**: Add, track, and manage your crypto holdings with profit/loss calculations.
- **Data Visualization**: Interactive pie charts for portfolio distribution.
- **Watchlist**: Track your favorite coins with ease.
- **Mobile Responsive**: Stunning glassmorphic UI that works on all devices.

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Custom theme)
- **Recharts** (Data visualization)
- **Lucide React** (Icons)
- **Axios** (API requests)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT** (Authentication)
- **Bcryptjs** (Password hashing)

## 📦 Installation & Setup

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or on Atlas)

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` file with your MongoDB URI and JWT Secret.
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 UI/UX Design

The application features a **Dark Mode Glassmorphic** theme:
- **Surface**: Deep onyx background with blurred overlays.
- **Accents**: Neon blue primary, emerald green for gains, and crimson red for losses.
- **Typography**: Clean, modern 'Inter' sans-serif.

## 🔒 Security
- Password hashing using Bcrypt.
- Protected API routes via JWT middleware.
- Input validation and secure error handling.

---
Designed with ❤️ by Antigravity.
