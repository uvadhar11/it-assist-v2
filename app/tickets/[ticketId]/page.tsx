import { Metadata } from 'next';
import { TicketDetails } from '@/components/ticket-details';
import { getAllTickets } from '@/lib/api';

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
  return (
    <div className='flex flex-col gap-6'>
      <TicketDetails ticketId={params.ticketId} />
    </div>
  );
}

// Add fallback for routes not generated at build time
export const dynamicParams = true;
