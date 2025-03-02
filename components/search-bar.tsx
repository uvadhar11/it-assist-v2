"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

/**
 * SearchBarProps interface defines the properties for the search bar component
 * @param searchQuery - Current search query string
 * @param setSearchQuery - Function to update the search query
 * @param dateRange - Current date range filter string
 * @param setDateRange - Function to update the date range filter
 */
interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: string | undefined;
  setDateRange: (date: string | undefined) => void;
}

/**
 * SearchBar component provides search and date filtering functionality
 * It contains a text input for keyword search and a date picker for date filtering
 */
export function SearchBar({ searchQuery, setSearchQuery, dateRange, setDateRange }: SearchBarProps) {
  // Local state to track the selected date in the calendar
  const [date, setDate] = useState<Date | undefined>(undefined);

  /**
   * Handles date selection from the calendar component
   * Updates both the local date state and the parent component's dateRange state
   * @param selectedDate - The date selected by the user or undefined if cleared
   */
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    // Format the date for display and filtering if a date is selected
    setDateRange(selectedDate ? format(selectedDate, 'MMM dd, yyyy') : undefined);
  };

  return (
    <div className="flex gap-4 mb-6">
      {/* Search input field - takes most of the available space */}
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Date range filter with popover calendar */}
      <div className="flex items-center gap-2">
        {/* Label for the date filter */}
        <span className="text-sm font-medium">Date Range</span>
        
        {/* Popover component for the calendar */}
        <Popover>
          {/* Button that triggers the calendar popover */}
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[180px] justify-start text-left font-normal",
                !date && "text-muted-foreground" // Muted text when no date is selected
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Enter Date"}
            </Button>
          </PopoverTrigger>
          
          {/* Calendar popover content */}
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}