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
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import Link from "next/link";

/**
 * Ticket interface defines the structure of a ticket object
 * @property id - Unique identifier for the ticket
 * @property topic - Subject or description of the ticket
 * @property status - Current status of the ticket (In Progress or Completed)
 * @property dateCreated - Date and time when the ticket was created
 * @property createdBy - Name of the user who created the ticket
 */
interface Ticket {
  id: string;
  topic: string;
  status: "In Progress" | "Completed";
  dateCreated: string;
  createdBy: string;
}

/**
 * TicketTableProps interface defines the properties for the ticket table component
 * @param searchQuery - Current search query for filtering tickets
 * @param dateRange - Current date range for filtering tickets
 */
interface TicketTableProps {
  searchQuery: string;
  dateRange: string | undefined;
}

/**
 * TicketTable component displays a table of support tickets with filtering and selection
 * It handles ticket data display, filtering based on search and date, and selection functionality
 */
export function TicketTable({ searchQuery, dateRange }: TicketTableProps) {
  // Sample ticket data - in a real application, this would come from an API
  const allTickets: Ticket[] = [
    {
      id: "1A3244FC3D1WO",
      topic: "Unable to update the account settings",
      status: "In Progress",
      dateCreated: "Jan 6, 2025 at 4:43 PM",
      createdBy: "Bob Billy",
    },
    {
      id: "12T9UAHF3KDF",
      topic: "",
      status: "In Progress",
      dateCreated: "",
      createdBy: "",
    },
    // Generate additional sample tickets for demonstration
    ...Array.from({ length: 20 }).map((_, i) => ({
      id: `TICKET${i + 3}`,
      topic: "",
      status: "In Progress" as const,
      dateCreated: "",
      createdBy: "",
    })),
  ];

  // State to track which tickets are currently selected
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  /**
   * Filter tickets based on search query and date range
   * Uses useMemo to avoid recalculating on every render
   */
  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      // Filter by search query (ticket ID or topic)
      const matchesSearch =
        searchQuery === "" ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.topic.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by date range
      const matchesDate = !dateRange || ticket.dateCreated.includes(dateRange);

      // Only include tickets that match both filters
      return matchesSearch && matchesDate;
    });
  }, [allTickets, searchQuery, dateRange]);

  /**
   * Toggles selection of all tickets
   * If all are currently selected, deselects all
   * If some or none are selected, selects all
   */
  const toggleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map((ticket) => ticket.id));
    }
  };

  /**
   * Toggles selection of a single ticket
   * @param ticketId - ID of the ticket to toggle
   */
  const toggleSelectTicket = (ticketId: string) => {
    if (selectedTickets.includes(ticketId)) {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    } else {
      setSelectedTickets([...selectedTickets, ticketId]);
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        {/* Table header with column titles */}
        <TableHeader>
          <TableRow>
            {/* Checkbox column for selecting all tickets */}
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  selectedTickets.length === filteredTickets.length &&
                  filteredTickets.length > 0
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Ticket ID #</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Created By</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table body with ticket rows */}
        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              {/* Checkbox cell for selecting individual tickets */}
              <TableCell>
                <Checkbox
                  checked={selectedTickets.includes(ticket.id)}
                  onCheckedChange={() => toggleSelectTicket(ticket.id)}
                />
              </TableCell>
              {/* Ticket ID with emphasized styling */}
              <TableCell className="font-medium">
                <Link href="/tickets/T-1234">{ticket.id}</Link>
              </TableCell>

              {/* Ticket topic/description */}
              <TableCell>{ticket.topic}</TableCell>
              {/* Status badge with custom styling for "In Progress" */}
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-yellow-400 text-black border-yellow-400"
                >
                  {ticket.status}
                </Badge>
              </TableCell>
              {/* Date when the ticket was created */}
              <TableCell>{ticket.dateCreated}</TableCell>
              {/* User who created the ticket */}
              <TableCell>{ticket.createdBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
