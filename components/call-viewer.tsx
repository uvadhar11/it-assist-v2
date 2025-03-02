'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, TicketIcon } from 'lucide-react';
import { format, formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { TranscriptViewer } from '@/components/transcript-viewer';
import Link from 'next/link';
import { connectToCallWebSocket } from '@/lib/api';
import { TranscriptUpdate, Transcript } from '@/types/api';

export function CallViewer({ callId }: { callId: string }) {
  const [data, setData] = useState<TranscriptUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Connect to WebSocket
    let retryCount = 0;
    const maxRetries = 3;

    const attemptConnection = () => {
      try {
        // Connect to WebSocket
        const closeConnection = connectToCallWebSocket(callId, (update) => {
          setData(update);
          setLoading(false);
        });

        // Set a timeout in case the connection doesn't receive any data
        const timeout = setTimeout(() => {
          if (loading) {
            if (retryCount < maxRetries) {
              console.log(
                `Retrying connection, attempt ${
                  retryCount + 1
                } of ${maxRetries}`,
              );
              retryCount++;
              closeConnection();
              attemptConnection();
            } else {
              setError(
                'Unable to load call data after multiple attempts. The call may have ended.',
              );
              setLoading(false);
            }
          }
        }, 5000);

        return () => {
          closeConnection();
          clearTimeout(timeout);
        };
      } catch (err) {
        console.error('WebSocket connection error:', err);
        setConnectionError(
          `Failed to connect to the server: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        setLoading(false);
        return () => {};
      }
    };

    return attemptConnection();
  }, [callId, loading]);

  // Display connection error if present
  if (connectionError) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.back()}
            className='mr-2'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-3xl font-bold tracking-tight'>
            Connection Error
          </h1>
        </div>

        <Card className='p-6'>
          <div className='text-center space-y-4'>
            <div className='text-red-500'>{connectionError}</div>
            <p className='text-muted-foreground'>
              Unable to connect to the call. This may be due to network issues
              or CORS configuration problems.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center p-12'>
        <Loader2 className='w-10 h-10 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.back()}
            className='mr-2'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-3xl font-bold tracking-tight'>Call Viewer</h1>
        </div>

        <Card className='p-6'>
          <div className='text-center space-y-4'>
            <div className='text-red-500'>{error || 'Call not found'}</div>
            <Button onClick={() => router.push('/')}>
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const callDuration = data.last_updated
    ? formatDistance(new Date(data.last_updated), new Date(data.start_time), {
        includeSeconds: true,
      })
    : 'Unknown duration';

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => router.back()}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-3xl font-bold tracking-tight'>
            Call {callId.substring(0, 8)}
          </h1>
          <Badge
            variant={data.is_active ? 'default' : 'secondary'}
            className='ml-2'
          >
            {data.is_active ? 'Active' : 'Completed'}
          </Badge>
        </div>

        <div className='flex items-center gap-2'>
          {data.ticket_id && (
            <Link href={`/tickets/${data.ticket_id}`}>
              <Button variant='outline'>
                <TicketIcon className='mr-2 h-4 w-4' />
                View Ticket
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className='grid md:grid-cols-3 gap-6'>
        {/* Call details card */}
        <Card>
          <CardHeader>
            <CardTitle>Call Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='grid grid-cols-2 gap-1'>
                <span className='text-muted-foreground'>Status:</span>
                <span>{data.is_active ? 'Active' : 'Completed'}</span>

                <span className='text-muted-foreground'>Started:</span>
                <span>
                  {format(new Date(data.start_time), 'MMM d, yyyy HH:mm')}
                </span>

                <span className='text-muted-foreground'>Duration:</span>
                <span>{callDuration}</span>

                <span className='text-muted-foreground'>Agent ID:</span>
                <span>{data.agent_id}</span>

                {data.ticket_id && (
                  <>
                    <span className='text-muted-foreground'>Ticket ID:</span>
                    <span className='truncate'>
                      <Link
                        href={`/tickets/${data.ticket_id}`}
                        className='text-primary hover:underline'
                      >
                        {data.ticket_id.substring(0, 8)}...
                      </Link>
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The transcript and suggestions cards will span 2 columns */}
        <div className='md:col-span-2'>
          <Tabs defaultValue='transcript' className='w-full'>
            <TabsList>
              <TabsTrigger value='transcript'>Live Transcript</TabsTrigger>
              <TabsTrigger value='summary'>Summary & Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value='transcript' className='mt-4'>
              {data.transcript && data.transcript.length > 0 ? (
                <TranscriptViewer
                  transcript={data.transcript}
                  autoScroll={data.is_active}
                />
              ) : (
                <Card>
                  <CardContent className='p-6 text-center text-muted-foreground'>
                    No transcript available for this call.
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
                    {data.summary ? (
                      <div
                        className='prose dark:prose-invert max-w-none'
                        dangerouslySetInnerHTML={{ __html: data.summary }}
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {data.is_active
                          ? 'Summary will be generated as the call progresses...'
                          : 'No summary available for this call.'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {data.suggestions && data.suggestions.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Suggested Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        {data.suggestions.map((suggestion, i) => (
                          <div key={i}>
                            <h4 className='font-medium'>{suggestion.title}</h4>
                            <p className='text-muted-foreground mt-1'>
                              {suggestion.description}
                            </p>
                            {data.suggestions &&
                              i < data.suggestions.length - 1 && (
                                <Separator className='my-3' />
                              )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className='p-6 text-center text-muted-foreground'>
                      {data.is_active
                        ? 'Suggestions will appear as the call progresses...'
                        : 'No suggestions available for this call.'}
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
