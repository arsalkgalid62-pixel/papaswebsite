# Education Website Setup Guide

This is a modern education website built with Next.js, Tailwind CSS, and Firebase for managing and displaying educational resources.

## Features

- **Admin Authentication**: Secure login for admins using Firebase Auth
- **File Upload**: Upload PDFs, DOCX files to Firebase Storage
- **Video Management**: Add YouTube video links organized by subject and topic
- **Subject Pages**: Dedicated pages for O Level English, A Level English, and O Level Psychology
- **Resource Display**: Clean UI showing downloadable files and embedded videos
- **Responsive Design**: Mobile-friendly using Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
cd education-website
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication**: Enable Email/Password provider
   - **Firestore Database**: Create database in production mode
   - **Storage**: Enable Firebase Storage

4. Get your Firebase config from Project Settings > General > Your apps
5. Update `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Create Admin User

1. Go to Firebase Console > Authentication > Users
2. Add a new user with email and password
3. This will be your admin login credentials

### 4. Firestore Security Rules

Update your Firestore rules to allow authenticated users to write and everyone to read:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /resources/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Storage Security Rules

Update your Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Troubleshooting Build Issues

If you encounter build errors related to native bindings or SWC, try:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. If using Windows and still having issues, try:
   ```bash
   npm install --force
   ```

3. For production build issues, you may need to use a different approach or deploy platform-specific builds.

## Usage

### Admin Functions

1. **Login**: Visit `/admin/login` and use your Firebase credentials
2. **Upload Resources**: After login, you'll see the admin dashboard where you can:
   - Upload PDF/DOCX files for notes and past papers
   - Add YouTube video links
   - Organize content by subject and topic
   - Add year information for past papers

### Student Functions

1. **Browse Subjects**: Students can visit subject pages to view resources
2. **Download Files**: Click download buttons for notes and past papers
3. **Watch Videos**: Videos are embedded directly on the page
4. **Filter Content**: Use filter buttons to show only notes, papers, or videos

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login page
│   │   └── dashboard/page.tsx      # Admin upload dashboard
│   ├── subjects/
│   │   ├── o-level-english/page.tsx
│   │   ├── a-level-english/page.tsx
│   │   └── o-level-psychology/page.tsx
│   ├── layout.tsx                  # Root layout with AuthProvider
│   └── page.tsx                    # Homepage
├── contexts/
│   └── AuthContext.tsx             # Authentication context
└── lib/
    └── firebase.ts                 # Firebase configuration
```

## Database Structure

### Resources Collection

Each resource document contains:

```typescript
{
  title: string;           // Resource title
  subject: string;         // 'o-level-english' | 'a-level-english' | 'o-level-psychology'
  type: string;           // 'notes' | 'papers' | 'video'
  url: string;            // Download URL or YouTube URL
  fileName?: string;      // Original file name
  year?: string;          // Year for past papers
  topic?: string;         // Topic name
  createdAt: Date;        // Creation timestamp
}
```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Update your Firebase project settings to include your production domain in authorized domains.

## Support

For issues or questions, refer to the Firebase documentation or Next.js documentation.