import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAllTickets } from '@/lib/api';
import { TicketDetailsContent } from '@/components/ticket-details-content';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ticket Details',
  description: 'View and manage ticket details',
};

// This function generates the static paths at build time
export async function generateStaticParams() {
  try {
    // For static export, we either need to return some default paths
    // or fetch from the API if available at build time
    const tickets = await getAllTickets();

    // Return ticket IDs as params
    return tickets.map((ticket) => ({
      ticketId: ticket.ticket_id,
    }));
  } catch (error) {
    console.error('Error fetching tickets for static generation:', error);
    // Return an empty array as fallback
    return [];
  }
}

export default function TicketPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const ticketId = params.ticketId;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 w-screen bg-[url('/gradient.png')] bg-cover bg-center">
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center gap-2 mb-6'>
          <Link href='/tickets'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-1'
            >
              <ArrowLeft className='h-4 w-4' />
              <span>Back to Tickets</span>
            </Button>
          </Link>
          <span className='text-sm text-gray-500'>Ticket #{ticketId}</span>
        </div>

        <div className='bg-white border rounded-lg shadow-sm overflow-hidden'>
          <TicketDetailsContent ticketId={ticketId} />
        </div>
      </div>
    </main>
  );
}

// Add fallback for routes not generated at build time
export const dynamicParams = true;
