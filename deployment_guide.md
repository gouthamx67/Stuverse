# Stuverse Deployment Guide

## 1. Prerequisites
- **GitHub Account**: Push your code to a GitHub repository.
- **Vercel Account**: For frontend deployment.
- **Render/Railway Account**: For backend deployment.
- **MongoDB Atlas**: For a cloud database (local MongoDB won't work in the cloud).

## 2. Backend Deployment (Render.com Recommended)
1.  **Push Code**: Ensure your latest code is on GitHub.
2.  **Creating Web Service**:
    *   Sign up/Login to [Render.com](https://render.com).
    *   Click "New +", select "Web Service".
    *   Connect your GitHub repository.
3.  **Configuration**:
    *   **Root Directory**: `server` (Important! Your backend is in the server folder).
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    *   Add the following variables in the "Environment" tab:
        *   `NODE_ENV`: `production`
        *   `MONGO_URI`: Your MongoDB Atlas connection string.
        *   `JWT_SECRET`: A strong secret key.
        *   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name.
        *   `CLOUDINARY_API_KEY`: Your Cloudinary API Key.
        *   `CLOUDINARY_API_SECRET`: Your Cloudinary API Secret.
        *   `CLIENT_URL`: The URL where your frontend will be (e.g., `https://stuverse.vercel.app`). You can update this *after* deploying the frontend.
    *   **Click "Create Web Service"**.
    *   Wait for deployment. Copy the **Service URL** (e.g., `https://stuverse-backend.onrender.com`).

## 3. Frontend Deployment (Vercel)
1.  **Import Project**:
    *   Sign up/Login to [Vercel](https://vercel.com).
    *   Click "Add New...", select "Project".
    *   Import your GitHub repository.
2.  **Configuration**:
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Framework Preset**: Vite (should be auto-detected).
3.  **Environment Variables**:
    *   Add the following variable:
        *   `VITE_API_URL`: The URL of your deployed backend + `/api` (e.g., `https://stuverse-backend.onrender.com/api`).
    *   **Click "Deploy"**.

## 4. Final Connection
1.  Once frontend is deployed, copy its URL (e.g., `https://stuverse.vercel.app`).
2.  Go back to Render (Backend) > Environment.
3.  Update/Add `CLIENT_URL` with your frontend URL.
4.  **Redeploy** the backend (Manual Deploy > Deploy latest commit) so it allows CORS from your new frontend.

## 5. You're Live! 🚀
Visit your Vercel URL to see your live application.
