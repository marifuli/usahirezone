# USAHireZone 🇺🇸

A production-ready, SEO-first US Job Board built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Firebase (Firestore, Authentication, Storage)**.

---

## 🌟 Key Features

- **No Custom Backend**: Reads and writes directly to Firebase Firestore.
- **Guest & Account Applications**: Job seekers can apply directly as guests (providing Name and Email) or log in to track their application history.
- **Seeding 100 Sample USA Jobs**: Automatic or 1-click seeding for 100 realistic US job postings from Google, Apple, Microsoft, Amazon, Meta, Stripe, Tesla, and more.
- **Dynamic Questionnaires**: Built-in support for 8 question types (Text, Textarea, Radio, Checkbox, Dropdown, Number, Date, File Upload) including default US Visa sponsorship questions (H-1B, OPT, CPT).
- **SEO & JSON-LD**: Full OpenGraph, Twitter cards, canonical URLs, `robots.txt`, dynamic `sitemap.xml`, and Schema.org schemas (`JobPosting`, `Organization`, `BreadcrumbList`, `WebSite`).
- **Default Light Theme**: Light mode by default across all devices with optional dark mode toggle.
- **Public Pages**:
  - `/` (Home page with hero, search, latest jobs)
  - `/jobs` & `/jobs/[slug]` (Browse jobs & Job details)
  - `/latest-jobs`, `/remote-jobs`, `/visa-sponsored-jobs`, `/internships`
  - `/companies` & `/company/[slug]`
  - `/categories` & `/category/[slug]`
  - `/states` & `/state/[slug]`
  - `/cities` & `/city/[slug]`
  - `/salary-guide` & `/career-resources`
  - `/terms`, `/privacy`, & `/contact`
- **User Dashboard**: Track saved jobs, submitted applications, update user profile details, and attach resumes.
- **Ad Slots**: Configurable `AdBanner` component for top, sidebar, inline, and footer ad placements.

---

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` or `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc...

# Set to true if using local Firebase Emulator Suite
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Ads (Set to true to enable ad banners)
NEXT_PUBLIC_ADS_ENABLED=false
```

---

### 2. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. **Enable Firestore Database**:
   - Go to **Build > Firestore Database**.
   - Click **Create Database**.
   - Choose a location (e.g. `us-central1`).
   - Start in **Test mode** (or paste the security rules below).
3. **Enable Authentication**:
   - Go to **Build > Authentication**.
   - Enable **Email/Password** and **Google Sign-In**.

---

### 3. Setting Up Security Rules

Copy the provided `firestore.rules` into your Firebase Console under **Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    match /jobs/{jobId} {
      allow read: if true;
      allow write: if true;
    }

    match /companies/{companyId} {
      allow read: if true;
      allow write: if true;
    }

    match /categories/{categoryId} {
      allow read: if true;
      allow write: if true;
    }

    match /states/{stateId} {
      allow read: if true;
      allow write: if true;
    }

    match /cities/{cityId} {
      allow read: if true;
      allow write: if true;
    }

    match /questionnaires/{questionnaireId} {
      allow read: if true;
      allow write: if true;
    }

    match /applications/{applicationId} {
      allow create: if true;
      allow read: if isSignedIn() && (
        resource.data.userId == request.auth.uid || request.auth.token.admin == true
      );
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    match /saved_jobs/{savedJobId} {
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow read, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

### 4. How to Seed 100 Sample USA Jobs

You can seed 100 realistic US jobs into your Firestore database using **any** of these methods:

- **1-Click Button**:
  1. Run `npm run dev` and open `http://localhost:3000`.
  2. If your database is empty, click the **"Seed 100 Sample USA Jobs"** button displayed in empty list views.
- **API Endpoint**:
  1. Open `http://localhost:3000/api/seed` in your browser.

---

### 5. Development & Production Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📁 Project Architecture

```text
app/                  # App Router pages and layouts
components/           # Shared UI components (Button, Card, Navbar, Footer, etc.)
features/
  ├── applications/   # Questionnaire renderer & Resume upload
  ├── auth/           # Login/Signup forms & Firebase Auth handlers
  ├── companies/      # Company cards & profiles
  ├── jobs/           # Job cards, salary/remote/visa badges, job lists
  ├── search/         # Search bar & filter sidebar
  └── seo/            # Metadata helpers & JSON-LD schemas
hooks/                # Reusable React hooks (useAuth, useJobs, useSavedJobs, etc.)
lib/
  ├── firebase/       # Firebase app, auth, firestore, storage initializers
  ├── firestore/      # Firestore collection CRUD queries & seed generator
  └── helpers/        # Formatters, slugifiers, utility functions
types/                # Strict TypeScript interface definitions
constants/            # US states, employment types, nav links, footer links
```

---

## 🛡️ License

MIT License. Built for **USAHireZone**.