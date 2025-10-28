# Thrive Pad - Personal Productivity App

A full-stack personal productivity application built with Next.js, React.js, Firebase, and Tailwind CSS.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React.js 18** - Frontend library with TypeScript
- **Firebase Authentication** - Protected user sign-in system
- **Firestore Database** - Real-time CRUD operations
- **Tailwind CSS** - Modern, responsive styling
- **Vercel Deployment** - Production hosting

## Features

- User-specific goal setting and tracking
- Private journaling system with tagging
- Task scheduling with automated reminders
- Real-time CRUD operations
- Role-based access control
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `.env.local` with your Firebase config

3. Run development server:
```bash
npm run dev
```

4. Deploy to Vercel:
```bash
vercel
```

## Project Structure

```
thrive-pad/
├── app/           # Next.js App Router pages
├── components/    # React components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── lib/           # Firebase configuration
├── types/         # TypeScript types
└── public/        # Static assets
```

Built as part of portfolio project (March 2024 - May 2024)
