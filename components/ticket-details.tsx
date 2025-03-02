'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Phone } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { TranscriptViewer } from '@/components/transcript-viewer';
import { getTicketById, closeTicket } from '@/lib/api';
import { Ticket } from '@/types/api';

export function TicketDetails({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchTicket() {
      try {
        const ticketData = await getTicketById(ticketId);
        setTicket(ticketData);
      } catch (error) {
        console.error('Failed to fetch ticket:', error);
        setError('Failed to load ticket details');
      } finally {
        setLoading(false);
      }
    }

    fetchTicket();
  }, [ticketId]);

  const handleCloseTicket = async () => {
    if (!ticket) return;

    setSubmitting(true);
    try {
      await closeTicket(ticket.ticket_id, resolution);
      // Update the ticket status in our local state
      setTicket({
        ...ticket,
        status: 'closed',
        updated_at: new Date().toISOString(),
        closed_at: new Date().toISOString(),
        summary: resolution || ticket.summary,
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to close ticket:', error);
      alert('Failed to close ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center p-12'>
        <Loader2 className='w-10 h-10 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className='p-6 bg-red-50 text-red-700 rounded-md'>
        {error || 'Ticket not found'}
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => router.back()}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-3xl font-bold tracking-tight'>
            Ticket #{ticket.ticket_id.substring(0, 8)}
          </h1>
          <Badge
            variant={
              ticket.status === 'open'
                ? 'default'
                : ticket.status === 'closed'
                ? 'secondary'
                : 'outline'
            }
            className='ml-2'
          >
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </Badge>
        </div>

        <div className='flex items-center gap-2'>
          {ticket.status === 'open' && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant='default'>Close Ticket</Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                  <DialogTitle>Close Support Ticket</DialogTitle>
                  <DialogDescription>
                    Please provide a resolution summary before closing this
                    ticket.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder='Describe how the issue was resolved...'
                  className='min-h-[100px]'
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                />
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCloseTicket} disabled={submitting}>
                    {submitting ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : null}
                    Close Ticket
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {ticket.call_id && (
            <Link href={`/calls/${ticket.call_id}`}>
              <Button variant='outline'>
                <Phone className='mr-2 h-4 w-4' />
                View Call
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className='grid md:grid-cols-3 gap-6'>
        {/* Ticket details card */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='grid grid-cols-2 gap-1'>
                <span className='text-muted-foreground'>Status:</span>
                <span>
                  {ticket.status.charAt(0).toUpperCase() +
                    ticket.status.slice(1)}
                </span>

                <span className='text-muted-foreground'>Created:</span>
                <span>
                  {format(new Date(ticket.created_at), 'MMM d, yyyy HH:mm')}
                </span>

                <span className='text-muted-foreground'>Last Updated:</span>
                <span>
                  {format(new Date(ticket.updated_at), 'MMM d, yyyy HH:mm')}
                </span>

                {ticket.closed_at && (
                  <>
                    <span className='text-muted-foreground'>Closed:</span>
                    <span>
                      {format(new Date(ticket.closed_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </>
                )}

                <span className='text-muted-foreground'>Agent ID:</span>
                <span>{ticket.agent_id}</span>

                <span className='text-muted-foreground'>Caller:</span>
                <span>{ticket.caller_number || 'Unknown'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The transcript and suggestions cards will span 2 columns */}
        <div className='md:col-span-2'>
          <Tabs defaultValue='transcript' className='w-full'>
            <TabsList>
              <TabsTrigger value='transcript'>Transcript</TabsTrigger>
              <TabsTrigger value='summary'>Summary & Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value='transcript' className='mt-4'>
              {ticket.transcript && ticket.transcript.length > 0 ? (
                <TranscriptViewer transcript={ticket.transcript} />
              ) : (
                <Card>
                  <CardContent className='p-6 text-center text-muted-foreground'>
                    No transcript available for this ticket.
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value='summary' className='mt-4'>
              <div className='grid gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Call Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ticket.summary ? (
                      <div
                        className='prose dark:prose-invert max-w-none'
                        dangerouslySetInnerHTML={{ __html: ticket.summary }}
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        No summary available for this ticket.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {ticket.suggestions && ticket.suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Suggested Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        {ticket.suggestions.map((suggestion, i) => (
                          <div key={i}>
                            <h4 className='font-medium'>{suggestion.title}</h4>
                            <p className='text-muted-foreground mt-1'>
                              {suggestion.description}
                            </p>
                            {i < ticket.suggestions!.length - 1 && (
                              <Separator className='my-3' />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
