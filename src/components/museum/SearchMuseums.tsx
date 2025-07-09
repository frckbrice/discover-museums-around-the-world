"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchMuseumsProps {
  value?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchMuseums({
  value = "",
  onSearch,
  placeholder = "Search museums by name or location..."
}: SearchMuseumsProps) {
  const [searchInput, setSearchInput] = useState(value);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Update local state when prop value changes
  useEffect(() => {
    setSearchInput(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);

    // Debounce search to avoid too many updates
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      onSearch(newValue);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          className="pr-10 text-muted-foreground"
          value={searchInput}
          onChange={handleInputChange}

        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </Button>
      </div>
    </form>
  );
}
