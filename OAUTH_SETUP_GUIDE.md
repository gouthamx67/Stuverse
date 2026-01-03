# OAuth Setup Guide for Stuverse

## Overview
This guide will help you configure Google and Microsoft OAuth authentication for the Stuverse application.

## Prerequisites
- A Google Cloud Platform account
- A Microsoft Azure account (for Microsoft OAuth)
- Access to your server's `.env` file

---

## Google OAuth Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" → "New Project"
3. Enter a project name (e.g., "Stuverse") and click "Create"

### Step 2: Enable Google+ API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Stuverse
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Click "Save and Continue" (default scopes are fine)
   - Test users: Add your email for testing
   - Click "Save and Continue"

4. Back to "Create OAuth client ID":
   - Application type: **Web application**
   - Name: Stuverse Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5000` (for development)
     - Your production backend URL (e.g., `https://api.stuverse.com`)
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://your-production-backend-url/api/auth/google/callback` (for production)
   - Click "Create"

5. Copy the **Client ID** and **Client Secret**

### Step 4: Add to Environment Variables
Add these to your `server/.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## Microsoft OAuth Setup

### Step 1: Register an Application in Azure
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Fill in the details:
   - Name: Stuverse
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: 
     - Platform: Web
     - URL: `http://localhost:5000/api/auth/microsoft/callback` (for development)
   - Click "Register"

### Step 2: Get Application Credentials
1. On the app's Overview page, copy the **Application (client) ID**
2. Go to "Certificates & secrets"
3. Click "New client secret"
4. Add a description (e.g., "Stuverse Secret") and choose an expiration
5. Click "Add"
6. **Important**: Copy the secret **Value** immediately (you won't be able to see it again)

### Step 3: Configure API Permissions
1. Go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Select "Delegated permissions"
5. Add these permissions:
   - `User.Read`
   - `email`
   - `profile`
   - `openid`
6. Click "Add permissions"

### Step 4: Add Redirect URIs for Production
1. Go to "Authentication"
2. Under "Platform configurations" → "Web", add your production redirect URI:
   - `https://your-production-backend-url/api/auth/microsoft/callback`
3. Click "Save"

### Step 5: Add to Environment Variables
Add these to your `server/.env` file:
```env
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
```

---

## Complete Environment Variables

Your `server/.env` file should include these variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Testing OAuth Authentication

### Development Testing
1. Restart your server after adding the environment variables
2. Navigate to `http://localhost:5173/signup` or `http://localhost:5173/login`
3. Click "Continue with Google" or "Continue with Microsoft"
4. You should be redirected to the respective OAuth provider
5. After authentication, you'll be redirected back to your app

### Common Issues

#### "OAuth is not configured" Error
- **Cause**: Missing `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MICROSOFT_CLIENT_ID`, or `MICROSOFT_CLIENT_SECRET` in `.env`
- **Solution**: Add the missing credentials to your `.env` file and restart the server

#### "Redirect URI mismatch" Error
- **Cause**: The redirect URI in your OAuth provider settings doesn't match the one in your code
- **Solution**: 
  - For Google: Check "Authorized redirect URIs" in Google Cloud Console
  - For Microsoft: Check "Redirect URIs" in Azure Portal
  - Ensure they match: `http://localhost:5000/api/auth/google/callback` or `http://localhost:5000/api/auth/microsoft/callback`

#### "Invalid client" Error
- **Cause**: Incorrect Client ID or Client Secret
- **Solution**: Double-check the credentials in your `.env` file

#### "Access denied" Error
- **Cause**: User denied permission or app not verified
- **Solution**: 
  - For testing, add your email to test users in Google Cloud Console
  - For production, submit your app for verification

---

## Production Deployment

### Important Notes for Production:

1. **Update Redirect URIs**: Add your production backend URL to the authorized redirect URIs in both Google Cloud Console and Azure Portal

2. **Environment Variables**: Ensure all OAuth credentials are set in your production environment

3. **HTTPS Required**: OAuth providers require HTTPS in production. Make sure your backend is served over HTTPS

4. **CORS Configuration**: Update your CORS settings to allow your production frontend URL

5. **Cookie Settings**: The code automatically adjusts cookie security based on `NODE_ENV`. In production:
   - Set `NODE_ENV=production`
   - Cookies will use `secure: true` (HTTPS only)
   - Cookies will use `sameSite: 'strict'`

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for `JWT_SECRET`
3. **Rotate client secrets** periodically
4. **Limit OAuth scopes** to only what you need
5. **Monitor OAuth usage** in Google Cloud Console and Azure Portal
6. **Enable 2FA** on your Google and Microsoft accounts
7. **Review OAuth consent screen** regularly

---

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure redirect URIs match exactly (including http/https and trailing slashes)
5. Test with a fresh browser session (clear cookies)

For more help:
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft OAuth Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
