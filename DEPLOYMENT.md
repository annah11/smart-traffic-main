# Deployment Guide

## Pre-deployment Checklist

- [x] Build succeeds: `npm run build`
- [x] No console errors
- [x] Responsive design (mobile, tablet, desktop)
- [x] Firebase configured (Firestore, Auth, Storage rules)

## Build & Preview

```bash
npm run build
npm run preview
```

Preview serves the production build at http://localhost:4173

## Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set root directory and build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables if needed

## Deploy to Netlify

1. Push to GitHub
2. Import at [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add redirect rule for SPA: `/* /index.html 200`

## Firebase Hosting (configured)

Hosting is configured in `firebase.json` with `dist` as the public directory and SPA rewrites.

```bash
# 1. Login (opens browser - run once)
firebase login

# 2. Build and deploy
npm run build
firebase deploy
```

Your app will be live at: `https://smart-traffic-891c8.web.app`

## Post-deployment

1. Add your production domain to Firebase Console → Authentication → Authorized domains
2. Update Firestore/Storage rules if needed
3. Test all routes and auth flows
