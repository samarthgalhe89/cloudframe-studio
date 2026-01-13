"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  User,
  Crop,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-crop", icon: Crop, label: "Smart Cropper" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Dynamic page information based on route
  const getPageInfo = () => {
    switch (pathname) {
      case '/home':
        return {
          title: 'Videos',
          description: 'Your uploaded videos library'
        };
      case '/video-crop':
        return {
          title: 'AI Smart Video Cropper',
          description: 'Resize videos for social media platforms'
        };
      case '/video-upload':
        return {
          title: 'Video Upload',
          description: 'Upload and compress your videos'
        };
      case '/social-share':
        return {
          title: 'Social Media Image Creator',
          description: 'Create images for all social platforms'
        };
      default:
        return {
          title: 'Frameo',
          description: 'AI-powered media processing'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <header className="w-full bg-white border-b border-[#FED7AA] shadow-sm">
          <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost text-[#1C1917] hover:bg-[#FED7AA]/50"
              >
                <MenuIcon />
              </label>
            </div>
            <div className="flex-1">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-[#1C1917]">
                  {pageInfo.title}
                </h1>
                <p className="text-sm text-[#78716C] mt-0.5">
                  {pageInfo.description}
                </p>
              </div>
            </div>
            <div className="flex-none flex items-center space-x-3">
              {session?.user && (
                <>
                  <div className="avatar placeholder">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F97316] to-[#EC4899] text-[#1C1917] flex items-center justify-center ring-2 ring-[#FED7AA] ">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-sm truncate max-w-xs lg:max-w-md text-[#78716C] hidden sm:block">
                    {session.user.email}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
            {children}
          </div>
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="bg-white-strong w-64 h-full flex flex-col border-r border-[#FED7AA]">
          <div className="flex items-center justify-center gap-3 py-6">
            <Logo size={55} className="flex-shrink-0 drop-shadow-lg" />
            <div className="text-lg font-bold text-[#1C1917]">
              Frameo
            </div>
          </div>
          <ul className="menu p-4 w-full text-base-content flex-grow">
            {sidebarItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 text-base ${pathname === item.href
                    ? "bg-gradient-to-r from-[#F97316] to-[#EC4899] text-[#1C1917] shadow-xl "
                    : "text-[#78716C] hover:bg-[#FED7AA]/50 hover:text-[#1C1917]"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {session?.user && (
            <div className="p-4">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 text-base w-full text-[#78716C] hover:bg-[#FED7AA]/50 hover:text-[#1C1917] justify-start"
              >
                <LogOutIcon className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </aside>
      </div >
    </div >
  );
}
