"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import Link from "next/link";

/**
 * Call interface defines the structure of a call object
 * @property id - Unique identifier for the call
 * @property topic - Subject or description of the call
 * @property clientName - Client name
 * @property dateCreated - Date and time when the call was created
 * @property assistedBy - Name of the employee who helped with the call
 */
interface Call {
  id: string;
  topic: string;
  clientName: string;
  dateCreated: string;
  assistedBy: string;
}

/**
 * CallTableProps interface defines the properties for the call table component
 * @param searchQuery - Current search query for filtering calls
 * @param dateRange - Current date range for filtering calls
 */
interface CallTableProps {
  searchQuery: string;
  dateRange: string | undefined;
}

/**
 * CallTable component displays a table of support calls with filtering and selection
 * It handles call data display, filtering based on search and date, and selection functionality
 */
export function CallTable({ searchQuery, dateRange }: CallTableProps) {
  // Sample call data - in a real application, this would come from an API
  const allCalls: Call[] = [
    {
      id: "1A3244FC3D1WO",
      topic: "Unable to update the account settings",
      clientName: "BTS",
      dateCreated: "Jan 6, 2025 at 4:43 PM",
      assistedBy: "Bob Billy",
    },
    {
      id: "12T9UAHF3KDF",
      topic: "",
      clientName: "BTS",
      dateCreated: "",
      assistedBy: "",
    },
    // Generate additional sample calls for demonstration
    ...Array.from({ length: 20 }).map((_, i) => ({
      id: `CALL${i + 3}`,
      topic: "",
      clientName: "BTS",
      dateCreated: "",
      assistedBy: "",
    })),
  ];

  // State to track which calls are currently selected
  // const [selectedCalls, setSelectedCalls] = useState<string[]>([]);

  /**
   * Filter calls based on search query and date range
   * Uses useMemo to avoid recalculating on every render
   */
  const filteredCalls = useMemo(() => {
    return allCalls.filter((call) => {
      // Filter by search query (call ID or topic)
      const matchesSearch =
        searchQuery === "" ||
        call.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.topic.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by date range
      const matchesDate = !dateRange || call.dateCreated.includes(dateRange);

      // Only include calls that match both filters
      return matchesSearch && matchesDate;
    });
  }, [allCalls, searchQuery, dateRange]);

  /**
   * Toggles selection of all calls
   * If all are currently selected, deselects all
   * If some or none are selected, selects all
   */
  // const toggleSelectAll = () => {
  //   if (selectedCalls.length === filteredCalls.length) {
  //     setSelectedCalls([]);
  //   } else {
  //     setSelectedCalls(filteredCalls.map((call) => call.id));
  //   }
  // };

  // /**
  //  * Toggles selection of a single call
  //  * @param callId - ID of the call to toggle
  //  */
  // const toggleSelectCall = (callId: string) => {
  //   if (selectedCalls.includes(callId)) {
  //     setSelectedCalls(selectedCalls.filter((id) => id !== callId));
  //   } else {
  //     setSelectedCalls([...selectedCalls, callId]);
  //   }
  // };

  return (
    <div className="border rounded-md">
      <Table>
        {/* Table header with column titles */}
        <TableHeader>
          <TableRow>
            {/* Checkbox column for selecting all calls */}
            {/* <TableHead className="w-[50px]"> */}
            {/* <Checkbox
                checked={
                  selectedCalls.length === filteredCalls.length &&
                  filteredCalls.length > 0
                }
                onCheckedChange={toggleSelectAll}
              /> */}
            {/* </TableHead> */}
            <TableHead className="pl-[50px]">Call ID #</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Assisted By</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table body with call rows */}
        <TableBody>
          {filteredCalls.map((call) => (
            <TableRow key={call.id}>
              {/* Checkbox cell for selecting individual calls */}
              {/* <TableCell> */}
              {/* <Checkbox
                  checked={selectedCalls.includes(call.id)}
                  onCheckedChange={() => toggleSelectCall(call.id)}
                /> */}
              {/* </TableCell> */}
              {/* Call ID with emphasized styling */}
              <TableCell className="font-medium pl-[50px]">
                <Link href="/calls/T-1234">{call.id}</Link>
              </TableCell>
              {/* Call topic/description */}
              <TableCell>{call.topic}</TableCell>
              {/* Status badge with custom styling for "In Progress" */}
              <TableCell>{call.clientName}</TableCell>
              {/* Date when the call was created */}
              <TableCell>{call.dateCreated}</TableCell>
              {/* User who created the call */}
              <TableCell>{call.assistedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
