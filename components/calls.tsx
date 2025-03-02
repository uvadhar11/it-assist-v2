"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";
import { CallTable } from "./calls-table";

/**
 * Dashboard component serves as the main layout container for the application
 * It manages the state for search and filtering functionality and composes the UI
 */
export function Calls() {
  // State for the search query text input
  const [searchQuery, setSearchQuery] = useState("");

  // State for the selected date range filter
  const [dateRange, setDateRange] = useState<string | undefined>(undefined);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar navigation component */}
      <Sidebar />

      {/* Main content area with overflow handling for scrolling */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Page header with company name */}
          <h1 className="text-2xl font-bold mb-6">Company Name</h1>

          {/* Search and filter controls */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          {/* Ticket data table with filtering applied */}
          <CallTable searchQuery={searchQuery} dateRange={dateRange} />
        </div>
      </main>
    </div>
  );
}
