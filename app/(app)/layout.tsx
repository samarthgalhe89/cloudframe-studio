"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
  User,
  Crop,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
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

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

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
        <header className="w-full bg-white border-b-2 border-[#E8DCC8] shadow-sm">
          <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost drawer-button"
              >
                <MenuIcon />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" onClick={handleLogoClick}>
                <div
                  className="
                  normal-case text-2xl font-bold tracking-tight cursor-pointer 
                  text-[#6B5335] transition duration-300
                  hover:drop-shadow-[0_0_6px_rgba(107,83,53,0.6)]
                "
                >
                  CloudFrame Studio
                </div>
              </Link>
            </div>
            <div className="flex-none flex items-center space-x-4">
              {session?.user && (
                <>
                  <div className="avatar placeholder">
                    <div className="w-8 h-8 rounded-full bg-[#6B5335] text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-sm truncate max-w-xs lg:max-w-md text-[#6B5335]">
                    {session.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-ghost btn-circle text-[#8B6F47] hover:bg-[#F5F1E8]"
                  >
                    <LogOutIcon className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-grow bg-[#F5F1E8]">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
            {children}
          </div>
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="bg-[#E8DCC8] w-64 h-full flex flex-col border-r-2 border-[#D4C4A8]">
          <div className="flex items-center justify-center py-6 border-b-2 border-[#D4C4A8]">
            <ImageIcon className="w-10 h-10 text-[#8B6F47]" />
          </div>
          <ul className="menu p-4 w-full text-base-content flex-grow">
            {sidebarItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-2 rounded-lg transition-all ${pathname === item.href
                    ? "bg-[#A88B5F] text-white shadow-md"
                    : "text-[#6B5335] hover:bg-[#D4C4A8]"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {session?.user && (
            <div className="p-4 border-t-2 border-[#D4C4A8]">
              <button
                onClick={handleSignOut}
                className="btn bg-[#6B5335] hover:bg-[#5A4329] text-white border-none w-full"
              >
                <LogOutIcon className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}