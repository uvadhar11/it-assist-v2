'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getAllTickets, closeTicket } from '@/lib/api';
import { Ticket } from '@/types/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface TicketTableProps {
  searchQuery: string;
  dateRange: string | undefined;
}

export function TicketTable({ searchQuery, dateRange }: TicketTableProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tickets from API
  useEffect(() => {
    async function fetchTickets() {
      try {
        const allTickets = await getAllTickets();
        setTickets(allTickets);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError('Failed to load tickets');
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  // Handle ticket status update
  const updateTicketStatus = async (ticketId: string, newStatus: 'closed') => {
    try {
      if (newStatus === 'closed') {
        await closeTicket(ticketId, 'Manually closed by agent');

        // Update the local state to reflect the change
        setTickets(
          tickets.map((ticket) =>
            ticket.ticket_id === ticketId
              ? {
                  ...ticket,
                  status: 'closed',
                  closed_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              : ticket,
          ),
        );
      }
    } catch (err) {
      console.error(`Failed to update ticket ${ticketId} status:`, err);
      alert('Failed to update ticket status. Please try again.');
    }
  };

  // Filter tickets based on search query
  const filteredTickets = tickets.filter((ticket) => {
    // Filter by search query (ticket ID or caller number)
    const matchesSearch =
      searchQuery === '' ||
      ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.caller_number &&
        ticket.caller_number.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by date range - would need to implement based on how dateRange is formatted
    const matchesDate = !dateRange || true; // Implement date filtering logic if needed

    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className='flex justify-center items-center p-12'>
        <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (error) {
    return <div className='p-4 bg-red-50 text-red-700 rounded-md'>{error}</div>;
  }

  if (filteredTickets.length === 0) {
    return (
      <div className='border rounded-md p-6 text-center text-muted-foreground'>
        No tickets found.
      </div>
    );
  }

  return (
    <div className='border rounded-md'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Caller Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Agent ID</TableHead>
            <TableHead className='w-[80px]'>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow
              key={ticket.ticket_id}
              className='cursor-pointer hover:bg-accent/50'
            >
              <TableCell className='font-medium'>
                <Link href={`/tickets/${ticket.ticket_id}`}>
                  {ticket.ticket_id.substring(0, 8)}...
                </Link>
              </TableCell>
              <TableCell>{ticket.caller_number || 'Unknown'}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    ticket.status === 'open'
                      ? 'default'
                      : ticket.status === 'closed'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {ticket.status.charAt(0).toUpperCase() +
                    ticket.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(ticket.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {format(new Date(ticket.updated_at), 'MMM d, yyyy HH:mm')}
              </TableCell>
              <TableCell>{ticket.agent_id}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/tickets/${ticket.ticket_id}`;
                      }}
                    >
                      View details
                    </DropdownMenuItem>

                    {ticket.status === 'open' && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTicketStatus(ticket.ticket_id, 'closed');
                        }}
                      >
                        Close ticket
                      </DropdownMenuItem>
                    )}

                    {ticket.call_id && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/calls/${ticket.call_id}`;
                        }}
                      >
                        View call
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
