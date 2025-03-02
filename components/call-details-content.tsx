'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  PhoneIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  PauseIcon,
} from 'lucide-react';
import CallAssistantInterface from '@/components/ui/call-assistant';
import Link from 'next/link';
import { getCallById, connectToCallWebSocket } from '@/lib/api';

interface CallTranscript {
  role: string;
  content: string;
  time?: string;
}

interface Suggestion {
  title: string;
  description: string;
}

interface CallDetails {
  call_id: string;
  agent_id: string;
  start_time: string;
  caller_number: string;
  last_activity: string;
  duration: number;
  ticket_id?: string;
  transcript?: CallTranscript[];
  summary?: string;
  suggestions?: Suggestion[];
  is_active: boolean;
}

export function CallDetailsContent({ callId }: { callId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callDetails, setCallDetails] = useState<CallDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    async function fetchCallDetails() {
      try {
        setIsLoading(true);
        // Use the API client instead of direct fetch
        const callData = await getCallById(callId);
        setCallDetails(callData);
      } catch (err) {
        console.error('Failed to fetch call details:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');

        // Set mock data for development is handled in the API client already
      } finally {
        setIsLoading(false);
      }
    }

    fetchCallDetails();

    // Set up WebSocket for live updates if call is active
    const disconnectWebSocket = connectToCallWebSocket(callId, (data) => {
      if (data.type === 'transcript_update') {
        setCallDetails((prevDetails) => ({
          ...(prevDetails || {
            call_id: callId,
            agent_id: data.agent_id || 'unknown',
            start_time: data.start_time || new Date().toISOString(),
            caller_number: 'unknown',
            last_activity: data.last_updated || new Date().toISOString(),
            duration: 0,
            is_active: data.is_active,
          }),
          transcript: data.transcript || [],
          summary: data.summary || prevDetails?.summary || '',
          suggestions: data.suggestions || prevDetails?.suggestions || [],
          is_active: data.is_active,
          ticket_id: data.ticket_id || prevDetails?.ticket_id,
          last_activity: data.last_updated || new Date().toISOString(),
        }));
      }
    });

    return () => {
      disconnectWebSocket();
    };
  }, [callId]);

  // Function to toggle audio playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Function to format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to create a ticket for this call
  const createTicket = async () => {
    if (!callDetails) return;

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          call_id: callId,
          agent_id: callDetails.agent_id,
          caller_number: callDetails.caller_number,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const data = await response.json();
      if (data.status === 'success' && data.ticket_id) {
        // Redirect to the new ticket
        window.location.href = `/tickets/${data.ticket_id}`;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
      alert('Failed to create ticket. Please try again.');
    }
  };

  if (isLoading) {
    return <div className='p-8 text-center'>Loading call details...</div>;
  }

  if (error) {
    return <div className='p-8 text-center text-red-500'>Error: {error}</div>;
  }

  if (!callDetails) {
    return <div className='p-8 text-center'>No call data found</div>;
  }

  return (
    <div className='flex-1'>
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
              <h3 className='font-medium mb-3'>Call Summary</h3>
              <div className='prose prose-sm'>
                {callDetails.summary ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: callDetails.summary }}
                  />
                ) : (
                  <p className='text-gray-700'>
                    No summary available yet. The call may still be in progress.
                  </p>
                )}
              </div>

              {!callDetails.summary && callDetails.is_active && (
                <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded'>
                  <p className='text-sm text-blue-700'>
                    This call is currently active. The summary will be generated
                    when the call concludes.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='transcript' className='mt-0 flex-1'>
            <div className='bg-gray-100 rounded p-4 h-full overflow-y-auto'>
              <div className='space-y-4'>
                {callDetails.transcript && callDetails.transcript.length > 0 ? (
                  callDetails.transcript.map((entry, idx) => (
                    <div key={idx}>
                      <p className='text-xs text-gray-500'>
                        {entry.role === 'agent' ? 'Agent' : 'Customer'} (
                        {entry.time || ''})
                      </p>
                      <p className='text-gray-800'>{entry.content}</p>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-700'>No transcript available yet.</p>
                )}

                {callDetails.is_active && (
                  <div className='animate-pulse p-2 border-l-4 border-blue-500 bg-blue-50'>
                    <p className='text-sm text-blue-800'>Call in progress...</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='suggestions' className='mt-0 flex-1'>
            <div className='bg-gray-100 rounded p-4 h-full overflow-y-auto'>
              <h3 className='font-medium mb-3'>AI Suggestions</h3>

              <div className='space-y-4'>
                {callDetails.suggestions &&
                callDetails.suggestions.length > 0 ? (
                  callDetails.suggestions.map((suggestion, idx) => (
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
                    No suggestions available yet. They will appear as the call
                    progresses.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Right sidebar with call info */}
          <div className='w-64 flex-shrink-0'>
            <Card className='p-5 border border-gray-200'>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium mb-1'>Call ID</h3>
                  <p className='text-gray-700'>{callDetails.call_id}</p>
                </div>

                <div>
                  <h3 className='text-sm font-medium mb-1'>Status</h3>
                  <Badge
                    variant='outline'
                    className={
                      callDetails.is_active
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }
                  >
                    {callDetails.is_active ? 'Active' : 'Completed'}
                  </Badge>
                </div>

                <div>
                  <h3 className='text-sm font-medium mb-1'>Phone #</h3>
                  <p className='text-gray-700'>{callDetails.caller_number}</p>
                </div>

                <div>
                  <h3 className='text-sm font-medium mb-1'>Agent</h3>
                  <p className='text-gray-700'>{callDetails.agent_id}</p>
                </div>

                <div>
                  <h3 className='text-sm font-medium mb-1'>Duration</h3>
                  <p className='text-gray-700'>
                    {formatDuration(callDetails.duration)}
                  </p>
                </div>

                {callDetails.ticket_id && (
                  <div>
                    <h3 className='text-sm font-medium mb-1'>Ticket</h3>
                    <Link
                      href={`/tickets/${callDetails.ticket_id}`}
                      className='text-blue-600 hover:underline'
                    >
                      {callDetails.ticket_id}
                    </Link>
                  </div>
                )}

                {callDetails.is_active && !callDetails.ticket_id && (
                  <Button
                    variant='default'
                    className='w-full bg-black text-white hover:bg-gray-800 mt-4'
                    onClick={createTicket}
                  >
                    Create Ticket
                  </Button>
                )}
              </div>
            </Card>

            <CallAssistantInterface />

            {/* Audio player */}
            <Card className='mt-4 bg-gray-200 border-0'>
              <div className='p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <PhoneIcon className='h-4 w-4 text-gray-600' />
                  <span className='text-xs text-gray-600'>
                    {callDetails.is_active ? 'Call in progress' : 'Call ended'}{' '}
                    • {formatDuration(callDetails.duration)}
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
          </div>
        </div>
      </Tabs>
    </div>
  );
}
