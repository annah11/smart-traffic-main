# Firebase Setup for Smart Traffic

## 1. Firestore Rules (REQUIRED - fixes "Missing or insufficient permissions")

Login and signup will fail until you deploy these rules.

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/) → your project **smart-traffic-891c8**
2. Click **Firestore Database** in the left menu
3. Open the **Rules** tab
4. **Replace all existing rules** with this (copy exactly):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**
6. Wait a few seconds, then try logging in again

## 2. Storage Rules (for profile photo upload)

1. Go to **Storage** in the left menu → **Rules** tab
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## 3. If you switched Firebase projects

1. **Hard refresh** the app: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Or clear site data: DevTools → Application → Clear storage

## 4. "Email already in use"

- One email = one account per Firebase project
- If you registered as **User**, sign in on the main login page
- If you registered as **Admin**, use **Login as Admin**
- Use a different email to create a second account
