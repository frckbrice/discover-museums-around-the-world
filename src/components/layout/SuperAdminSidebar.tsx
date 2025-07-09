"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuperAdminSidebar() {
  // const [location] = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const NavItem = ({ href, icon, label, notification }: { 
    href: string; 
    icon: React.ReactNode; 
    label: string;
    notification?: number;
  }) => {
    const isActive = window.location.href === href;
    
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
                <span className="ml-auto bg-accent text-primary text-xs rounded-full px-2 py-0.5">
                  {notification}
                </span>
              )}
            </>
          )}
          {collapsed && notification && (
            <span className="ml-auto bg-accent text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
              <div className="text-xs text-white text-opacity-60">Super Admin Portal</div>
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
        <NavSection title="Platform Management">
          <NavItem 
            href="/sadmin/dashboard" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>} 
            label="Dashboard" 
          />
          <NavItem 
            href="/sadmin/museums" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"></path><path d="M5 4v16"></path><path d="M5 4h14"></path><path d="M5 12h14"></path><path d="M12 4v16"></path><path d="M19 4v16"></path></svg>} 
            label="Museums" 
          />
          <NavItem 
            href="/sadmin/users" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>} 
            label="User Management" 
          />
          <NavItem 
            href="/sadmin/moderation" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m14.5 9-5 5"></path><path d="m9.5 9 5 5"></path></svg>} 
            label="Content Moderation" 
            notification={12}
          />
          <NavItem 
            href="/sadmin/analytics" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H4.6a2.6 2.6 0 0 1-2.6-2.6V3"></path><path d="m18 14 3-3-3-3"></path><path d="M3 8h17"></path><path d="M13 16h8"></path></svg>} 
            label="Analytics" 
          />
        </NavSection>
        
        <NavSection title="Settings">
          <NavItem 
            href="/sadmin/localization" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>} 
            label="Localization" 
          />
          <NavItem 
            href="/sadmin/settings" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>} 
            label="Platform Settings" 
          />
          <NavItem 
            href="/sadmin/maintenance" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path></svg>} 
            label="Backup & Maintenance" 
          />
        </NavSection>
      </div>
      
      <div className="p-4 border-t border-white border-opacity-10">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-white">
            {user?.fullName ? user.fullName.charAt(0) : 'S'}
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user?.fullName || 'Super Admin'}
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
