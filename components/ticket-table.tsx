"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

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
  status: "Unresolved" | "In Progress" | "Resolved";
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
  const [allTickets, setAllTickets] = useState<Ticket[]>([
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
  ]);

  // State to track which tickets are currently selected
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  // Function to update the status of a ticket
  const updateTicketStatus = (
    ticketId: string,
    newStatus: "Unresolved" | "In Progress" | "Resolved"
  ) => {
    setAllTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  return (
    <Table className="border rounded-md">
      {/* Table header with column titles */}
      <TableHeader>
        <TableRow>
          {/* Checkbox column for selecting all tickets */}
          {/* <TableHead className="w-[50px]"> */}
          {/* <Checkbox
              checked={
                selectedTickets.length === allTickets.length &&
                allTickets.length > 0
              }
              onCheckedChange={() => {
                if (selectedTickets.length === allTickets.length) {
                  setSelectedTickets([]);
                } else {
                  setSelectedTickets(allTickets.map((ticket) => ticket.id));
                }
              }}
            /> */}
          {/* </TableHead> */}
          <TableHead className="pl-[50px]">Ticket ID #</TableHead>
          <TableHead className="px-2">Topic</TableHead>
          <TableHead className="pl-8 pr-12">Status</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Created By</TableHead>
        </TableRow>
      </TableHeader>

      {/* Table body with ticket rows */}
      <TableBody>
        {allTickets.map((ticket) => (
          <TableRow key={ticket.id}>
            {/* Checkbox cell for selecting individual tickets */}
            {/* <TableCell> */}
            {/* <Checkbox
                checked={selectedTickets.includes(ticket.id)}
                onCheckedChange={() => {
                  if (selectedTickets.includes(ticket.id)) {
                    setSelectedTickets(
                      selectedTickets.filter((id) => id !== ticket.id)
                    );
                  } else {
                    setSelectedTickets([...selectedTickets, ticket.id]);
                  }
                }}
              /> */}
            {/* </TableCell> */}
            {/* Ticket ID with emphasized styling */}
            <TableCell className="font-medium pl-[50px]">
              {/* <Link href={`/tickets/${ticket.id}`}>{ticket.id}</Link> */}
              <Link href={`/tickets/T-1234`}>{ticket.id}</Link>
            </TableCell>

            {/* Ticket topic/description */}
            <TableCell className="px-2">{ticket.topic}</TableCell>
            {/* Status badge with custom styling for "In Progress" */}
            <TableCell className="pl-8 pr-12">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <Badge
                      variant="outline"
                      className={`${
                        ticket.status === "Unresolved"
                          ? "bg-red-400 text-white border-red-400"
                          : ticket.status === "In Progress"
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-green-400 text-white border-green-400"
                      } cursor-pointer`}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-100 border border-gray-300 rounded-md shadow-lg">
                  <DropdownMenuItem
                    onSelect={() => updateTicketStatus(ticket.id, "Unresolved")}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Unresolved
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      updateTicketStatus(ticket.id, "In Progress")
                    }
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => updateTicketStatus(ticket.id, "Resolved")}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Resolved
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>

            {/* Date when the ticket was created */}
            <TableCell>{ticket.dateCreated}</TableCell>
            {/* User who created the ticket */}
            <TableCell>{ticket.createdBy}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
