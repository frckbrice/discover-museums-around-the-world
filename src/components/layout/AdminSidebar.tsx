"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminSidebar() {
  // const [location] = useLocation();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const NavItem = ({ href, icon, label, notification }: { 
    href: string; 
    icon: React.ReactNode; 
    label: string;
    notification?: number;
  }) => {
    const isActive = pathname === href;
    
    return (
      <Link href={href}>
        <Button
          className={cn(
            "flex items-center px-4 py-2 text-sidebar-foreground",
            isActive ? "bg-sidebar-primary" : "hover:bg-white hover:bg-opacity-10"
          )}
        >
          <span className="mr-2">{icon}</span>
          {!collapsed && (
            <>
              <span>{label}</span>
              {notification && (
                <span className="ml-auto bg-sidebar-primary text-white text-xs rounded-full px-2 py-0.5">
                  {notification}
                </span>
              )}
            </>
          )}
          {collapsed && notification && (
            <span className="ml-auto bg-sidebar-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notification}
            </span>
          )}
        </Button>
      </Link>
    );
  };
  
  const NavSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      {!collapsed && (
        <div className="px-4 py-2 text-xs font-montserrat font-medium text-white text-opacity-60 uppercase">
          {title}
        </div>
      )}
      {collapsed && (
        <div className="px-4 py-2 border-b border-white border-opacity-10"></div>
      )}
      {children}
    </div>
  );

  return (
    <div className={cn(
      "bg-sidebar flex flex-col h-full border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-white border-opacity-10 flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mr-2"><path d="M2 20h20"></path><path d="M5 4v16"></path><path d="M5 4h14"></path><path d="M5 12h14"></path><path d="M12 4v16"></path><path d="M19 4v16"></path></svg>
          {!collapsed && (
            <div>
              <div className="font-montserrat font-bold text-sidebar-foreground">MuseumConnect</div>
              <div className="text-xs text-white text-opacity-60">Museum Admin Panel</div>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-white hover:bg-opacity-10"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
          )}
        </Button>
      </div>
      
      <div className="py-4 overflow-y-auto flex-1">
        <NavSection title="Content Management">
          <NavItem 
            href="/admin/dashboard" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>} 
            label="Dashboard" 
          />
          <NavItem 
            href="/admin/stories" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>} 
            label="Stories & Histories" 
          />
          <NavItem 
            href="/admin/gallery" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>} 
            label="Gallery Management" 
          />
          <NavItem 
            href="/admin/media" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12.5C2 9.46 4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4h-5"></path><circle cx="7.5" cy="11.5" r="2.5"></circle><path d="M10 5.5c.97 1.33 1.41 3.8 1.41 6.5"></path><path d="M17 17c.67 1 1 2.7 1 4"></path><path d="M15 21c-1.33.18-3.8.1-5-1"></path><path d="M7 16.5c-1.5 0-2.5-2-2.5-4"></path></svg>} 
            label="Media Library" 
          />
          <NavItem 
            href="/admin/events" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>} 
            label="Events" 
          />
        </NavSection>
        
        <NavSection title="Communications">
          <NavItem 
            href="/admin/messages" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>} 
            label="Messages" 
            notification={5}
          />
        </NavSection>
        
        <NavSection title="Settings">
          <NavItem 
            href="/admin/settings" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>} 
            label="Account Settings" 
          />
          <NavItem 
            href="/admin/profile" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.7 19H5.5L2 15.8V8.3L5.5 5h9.2L18 8.3v2.6"></path><path d="M20 21h-6"></path><path d="M17 13.7V21"></path><path d="M16 7h.01"></path><path d="M17 3.5v.01"></path><path d="M20 6h0"></path></svg>} 
            label="Museum Profile" 
          />
        </NavSection>
      </div>
      
      <div className="p-4 border-t border-white border-opacity-10">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-white">
            {user?.fullName ? user.fullName.charAt(0) : 'U'}
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user?.fullName || 'Museum Admin'}
              </p>
              <Button
                variant="link"
                size="sm"
                className="text-xs text-white text-opacity-60 p-0 h-auto hover:text-white"
                onClick={logout}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
