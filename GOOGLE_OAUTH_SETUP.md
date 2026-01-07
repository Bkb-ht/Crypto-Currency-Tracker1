# Google OAuth Setup Guide

## 🔐 Setting up Google OAuth for CryptoTrack

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**

### Step 2: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Name**: CryptoTrack Local
   - **Authorized JavaScript origins**: 
     - `http://localhost:5000`
     - `http://localhost:5174`
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback`

5. Click **Create**
6. Copy your **Client ID** and **Client Secret**

### Step 3: Update Backend .env File

Open `backend/.env` and replace the placeholder values:

```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### Step 4: Restart the Backend Server

```bash
cd backend
npm run dev
```

### ✅ Testing Google OAuth

1. Open http://localhost:5174/login
2. Click **"Sign in with Google"**
3. Select your Google account
4. Grant permissions
5. You'll be redirected back to the dashboard, logged in!

---

## 🎨 What You'll See

The login and register pages now have:
- A beautiful divider with "Or continue with"
- A Google sign-in button with the official Google logo
- Seamless OAuth flow that auto-logs you in

## 🔒 Security Notes

- Passwords for OAuth users are randomly generated
- Users can't use regular login with OAuth accounts
- JWT tokens are securely stored in localStorage
- All routes are protected with middleware

---

**Note**: For production deployment, you'll need to:
1. Update the redirect URIs to your production domain
2. Use environment variables for all sensitive data
3. Enable additional Google Cloud security features
