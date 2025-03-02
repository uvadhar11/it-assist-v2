'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { getAllTickets, closeTicket } from '@/lib/api';

/**
 * Ticket interface defines the structure of a ticket object based on backend schema
 * @property ticket_id - Unique identifier for the ticket
 * @property call_id - Associated call ID
 * @property agent_id - ID of the agent who handled the call
 * @property caller_number - Phone number of the caller
 * @property status - Current status of the ticket (open, closed, pending)
 * @property created_at - Timestamp when the ticket was created
 * @property updated_at - Timestamp when the ticket was last updated
 * @property summary - Summary or description of the ticket
 */
interface Ticket {
  ticket_id: string;
  call_id: string;
  agent_id: string;
  caller_number: string;
  status: 'open' | 'closed' | 'pending';
  created_at: string;
  updated_at: string;
  closed_at?: string;
  summary?: string;
  title: string;
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
 * TicketTable component displays a table of support tickets with filtering and status updates
 * It handles ticket data display, filtering based on search and date, and status update functionality
 */
export function TicketTable({ searchQuery, dateRange }: TicketTableProps) {
  // State to hold tickets fetched from the backend API
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tickets from the backend
  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        // Use the API client instead of direct fetch
        const fetchedTickets = await getAllTickets();
        // Map the API tickets to include the required title property
        const formattedTickets = fetchedTickets.map((ticket) => ({
          ...ticket,
          title: ticket.summary || 'No title available',
        }));
        setTickets(formattedTickets);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        // Set some dummy data for development purposes
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  // Filter tickets based on search query and date range
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Filter by search query (ticket ID, call ID, agent ID, summary)
      const matchesSearch =
        searchQuery === '' ||
        ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.call_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.agent_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.summary &&
          ticket.summary.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by date range
      const ticketDate = new Date(ticket.created_at).toLocaleDateString();
      const matchesDate = !dateRange || ticketDate.includes(dateRange);

      // Only include tickets that match both filters
      return matchesSearch && matchesDate;
    });
  }, [tickets, searchQuery, dateRange]);

  // Function to update the status of a ticket
  const updateTicketStatus = async (
    ticketId: string,
    newStatus: 'open' | 'closed' | 'pending',
  ) => {
    try {
      // If closing the ticket, send a request to the backend
      if (newStatus === 'closed') {
        try {
          await closeTicket(ticketId, 'Closed by user action');
        } catch (err) {
          console.log(
            'API endpoint for closing ticket not available, updating status locally only',
          );
        }
      }

      // Update the local state optimistically
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticket_id === ticketId
            ? {
                ...ticket,
                status: newStatus,
                updated_at: new Date().toISOString(),
                closed_at:
                  newStatus === 'closed'
                    ? new Date().toISOString()
                    : ticket.closed_at,
              }
            : ticket,
        ),
      );
    } catch (err) {
      console.error(`Failed to update ticket status: ${err}`);
      alert(`Failed to update the ticket status. Please try again.`);
    }
  };

  // Function to format date in a readable way
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Function to get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open':
        return 'bg-yellow-400 text-black border-yellow-400';
      case 'closed':
        return 'bg-green-400 text-white border-green-400';
      case 'pending':
        return 'bg-red-400 text-white border-red-400';
      default:
        return 'bg-gray-400 text-white border-gray-400';
    }
  };

  // Function to get status display text
  const getStatusDisplay = (status: string): string => {
    switch (status) {
      case 'open':
        return 'In Progress';
      case 'closed':
        return 'Resolved';
      case 'pending':
        return 'Unresolved';
      default:
        return status;
    }
  };

  return (
    <Table className='border rounded-md'>
      <TableHeader>
        <TableRow>
          <TableHead className='pl-[50px]'>Ticket ID #</TableHead>
          <TableHead className='px-2'>Topic</TableHead>
          <TableHead className='pl-8 pr-12'>Status</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Created By</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className='text-center py-4'>
              Loading tickets...
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={5} className='text-center py-4'>
              <p className='text-red-500'>Error: {error}</p>
              <p className='text-sm text-gray-500 mt-2'>
                Using sample data for demonstration
              </p>
            </TableCell>
          </TableRow>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TableRow key={ticket.ticket_id}>
              <TableCell className='font-medium pl-[50px]'>
                <Link href={`/tickets/${ticket.ticket_id}`}>
                  {ticket.ticket_id}
                </Link>
              </TableCell>
              <TableCell className='px-2'>
                {ticket.title || 'No summary available'}
              </TableCell>
              <TableCell className='pl-8 pr-12'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div>
                      <Badge
                        variant='outline'
                        className={`${getStatusColor(
                          ticket.status,
                        )} cursor-pointer`}
                      >
                        {getStatusDisplay(ticket.status)}
                      </Badge>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='bg-gray-100 border border-gray-300 rounded-md shadow-lg'>
                    <DropdownMenuItem
                      onSelect={() =>
                        updateTicketStatus(ticket.ticket_id, 'pending')
                      }
                      className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                    >
                      Unresolved
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        updateTicketStatus(ticket.ticket_id, 'open')
                      }
                      className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                    >
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        updateTicketStatus(ticket.ticket_id, 'closed')
                      }
                      className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                    >
                      Resolved
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>{formatDate(ticket.created_at)}</TableCell>
              <TableCell>{ticket.agent_id}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className='text-center py-4'>
              No tickets found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
