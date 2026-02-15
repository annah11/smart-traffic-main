# Password Reset Email Setup

If password reset emails are not being received, check the following in **Firebase Console**:

## 1. Enable Email/Password Sign-in

1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project
2. **Authentication** → **Sign-in method**
3. Enable **Email/Password** provider

## 2. Add Authorized Domains

1. **Authentication** → **Settings** (gear icon) → **Authorized domains**
2. Add your domains:
   - `localhost` (for local development)
   - Your production domain (e.g. `your-app.vercel.app`)

## 3. Emails Going to Spam?

Firebase's default emails often land in spam. To improve deliverability:

1. **Authentication** → **Templates** → **SMTP Settings**
2. Configure a custom SMTP server (e.g. Gmail, SMTP2GO, SendGrid)
3. Or use [Custom Email Domain](https://firebase.google.com/docs/auth/email-custom-domain)

## 4. Verify the User Exists

Password reset only works for users that exist in Firebase Auth. Ensure the email was used to:
- Register via the app (user or admin signup), or
- Be created by an admin in the Admin Dashboard
