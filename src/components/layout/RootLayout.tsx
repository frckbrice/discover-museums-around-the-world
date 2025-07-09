"use client";

import { ReactNode, useState, useEffect } from "react";
import PublicNavbar from "./PublicNavbar";
import AdminSidebar from "./AdminSidebar";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  const { user } = useAuth();
  const [interfaceType, setInterfaceType] = useState<
    "public" | "admin" | "superadmin"
  >("public");

  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      setInterfaceType("admin");
    } else if (pathname?.startsWith("/sadmin")) {
      setInterfaceType("superadmin");
    } else {
      setInterfaceType("public");
    }

    // setShowSwitcher(true);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Layout based on interface type */}
      {interfaceType === "public" && (
        <>
          <PublicNavbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-primary text-white py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M2 20h20"></path>
                      <path d="M5 4v16"></path>
                      <path d="M5 4h14"></path>
                      <path d="M5 12h14"></path>
                      <path d="M12 4v16"></path>
                      <path d="M19 4v16"></path>
                    </svg>
                    <span className="font-playfair font-bold text-xl">
                      MuseumConnect
                    </span>
                  </div>
                  <p className="mt-2 text-sm opacity-80">
                    Connecting museums, stories, and people worldwide.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-montserrat font-medium mb-2">
                      Explore
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <a href="/" className="hover:underline">
                          Museums
                        </a>
                      </li>
                      <li>
                        <a href="/stories" className="hover:underline">
                          Stories
                        </a>
                      </li>
                      <li>
                        <a href="/map" className="hover:underline">
                          Map
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-montserrat font-medium mb-2">About</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <a href="#" className="hover:underline">
                          About Us
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline">
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline">
                          Terms of Service
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-montserrat font-medium mb-2">
                      Connect
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <a href="/contact" className="hover:underline">
                          Contact Us
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline">
                          Support
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline">
                          Newsletter
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-white border-opacity-20 text-center text-sm opacity-70">
                <p>© 2025 MuseumConnect. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {interfaceType === "admin" && (
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      )}

      {interfaceType === "superadmin" && (
        <div className="flex h-screen overflow-hidden">
          <SuperAdminSidebar />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      )}
    </div>
  );
}

export default RootLayout;
