'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import {
  PhoneIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  PauseIcon,
} from 'lucide-react';
import { getTicketById, closeTicket } from '@/lib/api';

interface Transcript {
  role: string;
  content: string;
  time?: string;
}

interface Suggestion {
  title: string;
  description: string;
}

interface TicketDetails {
  ticket_id: string;
  call_id: string;
  agent_id: string;
  caller_number: string;
  status: 'open' | 'closed' | 'pending';
  created_at: string;
  updated_at: string;
  closed_at?: string;
  transcript?: Transcript[];
  transcript_string?: string;
  summary?: string;
  suggestions?: Suggestion[];
}

export function TicketDetailsContent({ ticketId }: { ticketId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    async function fetchTicketDetails() {
      try {
        setIsLoading(true);
        // Use the API client instead of direct fetch
        const ticketData = await getTicketById(ticketId);
        setTicketDetails(ticketData);
      } catch (err) {
        console.error('Failed to fetch ticket details:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');

        // Set mock data for development is handled in the API client already
      } finally {
        setIsLoading(false);
      }
    }

    fetchTicketDetails();
  }, [ticketId]);

  // Function to toggle audio playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Function to handle closing a ticket
  const handleCloseTicket = async () => {
    if (!ticketDetails) return;

    try {
      await closeTicket(ticketId, 'Closed by user action');

      // Update local state to reflect the closed status
      setTicketDetails({
        ...ticketDetails,
        status: 'closed',
        closed_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error closing ticket:', err);
      alert('Failed to close ticket. Please try again.');
    }
  };

  // Get status display
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

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500 text-white';
      case 'closed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-red-400 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  if (isLoading) {
    return <div className='p-8 text-center'>Loading ticket details...</div>;
  }

  if (error) {
    return <div className='p-8 text-center text-red-500'>Error: {error}</div>;
  }

  if (!ticketDetails) {
    return <div className='p-8 text-center'>No ticket data found</div>;
  }

  return (
    <div className='flex'>
      <div className='flex-1 p-6'>
        {/* Header section */}
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h2 className='text-sm text-gray-600 mb-1'>Subject</h2>
            <h1 className='text-xl font-semibold'>
              {ticketDetails.summary && ticketDetails.summary.length > 60
                ? ticketDetails.summary.substring(0, 60) + '...'
                : ticketDetails.summary || 'Product not working as expected'}
            </h1>
          </div>
          {ticketDetails.status !== 'closed' && (
            <Button
              variant='default'
              className='bg-black text-white hover:bg-gray-800'
              onClick={handleCloseTicket}
            >
              Close Ticket
            </Button>
          )}
        </div>

        {/* Tabs and content */}
        <Tabs defaultValue='summary' className='w-full'>
          <TabsList className='mb-4 bg-transparent border-b border-gray-200 w-full justify-start'>
            <TabsTrigger
              value='summary'
              className='data-[state=active]:text-activepurple data-[state=active]:border-b-2 data-[state=active]:border-activepurple data-[state=active]:shadow-none rounded-none px-4 py-2'
            >
              Summary
            </TabsTrigger>
            <TabsTrigger
              value='transcript'
              className='data-[state=active]:text-activepurple data-[state=active]:border-b-2 data-[state=active]:border-activepurple data-[state=active]:shadow-none rounded-none px-4 py-2'
            >
              Transcript
            </TabsTrigger>
            <TabsTrigger
              value='suggestions'
              className='data-[state=active]:text-activepurple data-[state=active]:border-b-2 data-[state=active]:border-activepurple data-[state=active]:shadow-none rounded-none px-4 py-2'
            >
              Suggestions
            </TabsTrigger>
          </TabsList>

          <div className='flex gap-6'>
            <TabsContent value='summary' className='mt-0 flex-1'>
              <div className='bg-gray-100 rounded p-4 h-full overflow-y-auto'>
                <h3 className='font-medium mb-3'>Ticket Summary</h3>
                {ticketDetails.summary ? (
                  <div
                    className='prose prose-sm'
                    dangerouslySetInnerHTML={{ __html: ticketDetails.summary }}
                  />
                ) : (
                  <p className='text-gray-700 mb-3'>
                    No summary available for this ticket.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value='transcript' className='mt-0 flex-1'>
              <div className='bg-gray-100 rounded p-4 h-full overflow-y-auto'>
                <div className='space-y-4'>
                  {ticketDetails.transcript &&
                  ticketDetails.transcript.length > 0 ? (
                    ticketDetails.transcript.map((entry, idx) => (
                      <div key={idx}>
                        <p className='text-xs text-gray-500'>
                          {entry.role === 'agent' ? 'Agent' : 'Customer'}
                          {entry.time
                            ? ` (${
                                typeof entry.time === 'string'
                                  ? entry.time
                                  : new Date(entry.time).toLocaleTimeString()
                              })`
                            : ''}
                        </p>
                        <p className='text-gray-800'>{entry.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-700'>
                      No transcript available for this ticket.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value='suggestions' className='mt-0 flex-1'>
              <div className='bg-gray-100 rounded p-4 h-full overflow-y-auto'>
                <h3 className='font-medium mb-3'>AI Suggestions</h3>

                <div className='space-y-4'>
                  {ticketDetails.suggestions &&
                  ticketDetails.suggestions.length > 0 ? (
                    ticketDetails.suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className='bg-white p-3 rounded border border-gray-200'
                      >
                        <h4 className='text-sm font-medium mb-1'>
                          {suggestion.title}
                        </h4>
                        <p className='text-sm text-gray-700'>
                          {suggestion.description}
                        </p>
                        <Button variant='outline' size='sm' className='mt-2'>
                          {idx === 0
                            ? 'View Details'
                            : idx === 1
                            ? 'Send to Customer'
                            : 'View Similar Tickets'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-700'>
                      No suggestions available for this ticket.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Right sidebar with ticket info */}
            <div className='w-64 flex-shrink-0'>
              <Card className='p-5 border border-gray-200'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-medium mb-1'>Ticket #</h3>
                    <p className='text-gray-700'>{ticketDetails.ticket_id}</p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium mb-1'>Status</h3>
                    <Badge
                      variant='outline'
                      className={getStatusColor(ticketDetails.status)}
                    >
                      {getStatusDisplay(ticketDetails.status)}
                    </Badge>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium mb-1'>Phone #</h3>
                    <p className='text-gray-700'>
                      {ticketDetails.caller_number}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium mb-1'>Agent</h3>
                    <p className='text-gray-700'>{ticketDetails.agent_id}</p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium mb-1'>Created</h3>
                    <p className='text-gray-700 text-sm'>
                      {new Date(ticketDetails.created_at).toLocaleString()}
                    </p>
                  </div>

                  {ticketDetails.closed_at && (
                    <div>
                      <h3 className='text-sm font-medium mb-1'>Closed</h3>
                      <p className='text-gray-700 text-sm'>
                        {new Date(ticketDetails.closed_at).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {ticketDetails.status !== 'closed' && (
                    <Button
                      variant='default'
                      className='w-full bg-black text-white hover:bg-gray-800 mt-4'
                    >
                      Update
                    </Button>
                  )}
                </div>
              </Card>

              {/* Audio player */}
              {ticketDetails.call_id && (
                <Card className='mt-4 bg-gray-200 border-0'>
                  <div className='p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <PhoneIcon className='h-4 w-4 text-gray-600' />
                      <span className='text-xs text-gray-600'>
                        Call {ticketDetails.call_id}
                      </span>
                    </div>

                    <div className='bg-gray-700 p-3 rounded'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Slider
                          value={[audioProgress]}
                          max={100}
                          step={1}
                          className='flex-1'
                          onValueChange={(value) => setAudioProgress(value[0])}
                        />
                      </div>

                      <div className='flex justify-center gap-4'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-white hover:bg-gray-600'
                        >
                          <SkipBackIcon className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-white hover:bg-gray-600'
                          onClick={togglePlayback}
                        >
                          {isPlaying ? (
                            <PauseIcon className='h-4 w-4' />
                          ) : (
                            <PlayIcon className='h-4 w-4' />
                          )}
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-white hover:bg-gray-600'
                        >
                          <SkipForwardIcon className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
