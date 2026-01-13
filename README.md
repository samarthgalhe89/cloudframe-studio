# Cloudframe Studio

An AI-powered, premium media management SaaS platform built with Next.js, TypeScript, and Cloudinary. Designed for modern content creators to optimize, compress, and transform videos and images with intelligent automation and a stunning user interface.

---

## **✨ Features**

### **🎨 Premium UI/UX**
- **Dynamic Authentication Flow**: Custom sliding panel transitions with Framer Motion animations
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Sunset Creator Theme**: Warm gradients (Orange to Pink) with glassmorphic effects
- **Custom SVG Logo**: Film reel-inspired brand identity
- **Micro-animations**: Smooth, professional interactions throughout

### **🤖 AI-Powered Media Processing**
- **Smart Cropping**: Automatically detect subjects and resize videos for Reels, TikToks, and Shorts
- **Ultra Compression**: Reduce file sizes by up to 90% without losing visual quality
- **Social Media Formatting**: One-click transformation for Instagram, Twitter, Facebook, and more

### **🔐 Security & Authentication**
- **NextAuth.js Integration**: Secure, production-ready authentication
- **Google OAuth**: One-click sign-in with Google
- **Password Authentication**: With strength indicators and validation
- **Protected Routes**: API-level security for all sensitive operations

### **📊 Media Dashboard**
- **CRUD Operations**: Upload, preview, download, and delete media files
- **Real-time Feedback**: Live compression stats and processing status
- **Metadata Tracking**: Full history and analytics for all uploads

---

## **🛠 Tech Stack**

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- Framer Motion (Advanced animations)
- Lucide React (Icons)

**Backend**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js

**Services**
- Cloudinary (Media processing & CDN)
- Google OAuth

**Additional Libraries**
- dayjs (Date handling)
- filesize (File size formatting)

---

## **🚀 Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/samarthgalhe89/cloudframe-studio.git
cd cloudframe-studio
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Set Up Environment Variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### **4. Set Up Database**

Run Prisma migrations to set up your database:

```bash
npx prisma generate
npx prisma db push
```

### **5. Start Development Server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

---

## **📖 Usage**

1. **Sign Up / Sign In**: Create an account using email/password or Google OAuth
2. **Upload Media**: Navigate to the dashboard and upload videos or images
3. **AI Processing**: Watch as Cloudinary automatically compresses and optimizes your files
4. **Smart Cropping**: Use AI to crop videos for different social media platforms
5. **Download & Share**: Get your optimized media ready for posting

---

## **📁 Project Structure**

```
cloudframe-studio/
├── app/
│   ├── (auth)/              # Authentication pages (sign-in, sign-up)
│   ├── api/                 # API routes (auth, media operations)
│   ├── page.tsx             # Landing page
│   └── layout.tsx           # Root layout
├── components/              # Reusable React components
│   ├── AuthSplitScreen.tsx  # Dynamic auth layout with animations
│   ├── Logo.tsx             # Custom SVG logo
│   └── ...
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
├── lib/                     # Utility functions
└── README.md
```

---

## **🎯 Key Highlights**

- **Production-Ready**: Built with scalability and security in mind
- **Type-Safe**: Full TypeScript coverage for reliability
- **Modern Architecture**: App Router, Server Components, and API Routes
- **Premium Animations**: Framer Motion for sophisticated UI transitions
- **Mobile-First**: Responsive design that works beautifully on all devices
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Performance**: Optimized images, lazy loading, and efficient data fetching

---

## **🤝 Contributing**

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## **👨‍💻 Author**

**Samarth Galhe**

---

## **🙏 Acknowledgements**

- [Cloudinary](https://cloudinary.com/) - Media processing platform
- [Next.js](https://nextjs.org/) - React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

## **📊 Project Resume Description**

**Cloudframe Studio - AI-Powered Smart Media Platform | Next.js, TypeScript, Prisma**

• Developed **Cloudframe Studio**, an AI-driven media SaaS that automates video compression and intelligent subject-aware cropping using Cloudinary's machine learning models, featuring a high-fidelity dashboard with custom "sliding" authentication animations built with Framer Motion.

• Architected a robust full-stack solution using **Next.js 14**, **TypeScript**, and **Prisma ORM** to handle secure AI processing pipelines, protected API routes with NextAuth.js, and seamless data synchronization across a fully responsive, mobile-optimized interface with advanced Framer Motion animations.

---

**Built with ❤️ for Content Creators**