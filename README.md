# Frameo

A full-stack SaaS web application for uploading, compressing, previewing, and managing videos and images using Cloudinary. Built for creators and developers to efficiently handle heavy media files and generate social-media-ready content.

---

## **Features**

- **Authentication:** Secure sign-in/sign-up flows using Clerk.
- **Landing Page:** Modern, animated landing page with sample video preview and feature highlights.
- **Video Upload:** Upload large video files (up to 60MB) with automatic compression via Cloudinary.
- **Video Dashboard:** Manage uploaded videos—preview, download, and delete with real-time feedback.
- **Social Share Image Creator:** Transform images to fit popular social media formats (Instagram, Twitter, Facebook) and download instantly.
- **API & Database:** Custom Next.js API routes and Prisma ORM for metadata management in PostgreSQL.
- **Security:** Protected routes and secure media uploads.

---

## **Tech Stack**

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM, PostgreSQL
- **Auth:** Clerk
- **Media:** Cloudinary
- **Other:** dayjs, Lucide React, filesize

---

## **Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/samarthgalhe89/frameo.git
cd frameo
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Set Up Environment Variables**

Create a `.env.local` file and add:

```
DATABASE_URL=your_postgres_url
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### **4. Run Prisma Migrations**

```bash
npx prisma migrate dev
```

### **5. Start the Development Server**

```bash
npm run dev
```

---

## **Usage**

- **Sign Up / Sign In:** Create an account using Clerk authentication.
- **Upload Videos:** Go to the dashboard, upload your video, and view compression stats.
- **Manage Videos:** Preview, download, or delete videos from your library.
- **Social Share:** Upload an image, select a social media format, preview, and download the transformed image.

---

## **Folder Structure**

```
frameo/
├── app/                # Next.js app directory (pages, API routes)
├── components/         # Reusable React components
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets (sample video, images)
├── styles/             # Global styles (Tailwind)
├── .env.local          # Environment variables
└── README.md           # Project documentation
```

---

## **Learnings & Highlights**

- Advanced Cloudinary integration for secure uploads and transformations.
- Full-stack development with Next.js, Prisma, and PostgreSQL.
- Robust authentication and route protection using Clerk.
- Real-time feedback and modern UI/UX with React and Tailwind CSS.
- Scalable, modular architecture for future features.

---

## **Author**

Samarth Galhe

---

## **Contributing**

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## **Acknowledgements**

- [Cloudinary](https://cloudinary.com/)
- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)