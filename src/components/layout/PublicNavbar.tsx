"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnClickOutside } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search } from "lucide-react";

export default function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.length > 1) {
      setSearchResults([
        "Metropolitan Museum of Modern Art",
        "Museum of Science and Innovation",
        "National Gallery of History",
      ]);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (result: string) => {
    setSearchValue(result);
    setShowSearchResults(false);
  };

  useOnClickOutside(searchRef, () => setShowSearchResults(false));

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo-museum.jpg"
                alt="MuseumCall Logo"
                width={100}
                height={90}
                className="object-contain"
                priority
              />
              {/* <span className="font-playfair font-bold text-xl text-primary">MuseumConnect</span> */}
            </Link>
            <div className="hidden md:flex space-x-6">
              {[
                { label: "Discover", path: "/" },
                { label: "Stories", path: "/stories" },
                { label: "Map", path: "/map" },
                { label: "Contact", path: "/contact" },
              ].map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  className={`px-1 pt-1 text-sm font-medium font-montserrat border-b-2 ${
                    pathname === path
                      ? "border-destructive text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Search & Login */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-64" ref={searchRef}>
              <Input
                type="text"
                placeholder="Search museums..."
                className="pl-4 pr-10 py-2 rounded-full"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <Search className="w-4 h-4" />
              </Button>

              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-border rounded-md shadow-lg">
                  <ul className="py-1">
                    {searchResults.map((result, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border shadow-sm">
          <div className="px-4 py-3 space-y-2">
            {[
              { label: "Discover", path: "/" },
              { label: "Stories", path: "/stories" },
              { label: "Map", path: "/map" },
              { label: "Contact", path: "/contact" },
            ].map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                className={`block rounded-md px-3 py-2 text-base font-montserrat font-medium ${
                  pathname === path
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-border px-4 py-3">
            <Input
              type="text"
              placeholder="Search museums..."
              className="w-full px-4 py-2 rounded-full"
            />
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                Sign In
              </Button>
              <Button variant="default" size="sm" className="flex-1">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
