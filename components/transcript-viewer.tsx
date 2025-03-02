'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Transcript } from '@/types/api';

interface TranscriptViewerProps {
  transcript: Transcript[];
  autoScroll?: boolean;
  maxHeight?: string;
}

export function TranscriptViewer({
  transcript,
  autoScroll = true,
  maxHeight = '500px',
}: TranscriptViewerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when transcript updates
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [transcript, autoScroll]);

  return (
    <Card className='border'>
      <ScrollArea ref={scrollAreaRef} className='p-4' style={{ maxHeight }}>
        <div className='space-y-4'>
          {transcript.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-start' : 'justify-start'
              }`}
            >
              <Avatar className='h-8 w-8'>
                <AvatarFallback
                  className={
                    message.role === 'user' ? 'bg-primary/10' : 'bg-muted'
                  }
                >
                  {message.role === 'user' ? 'U' : 'A'}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='text-sm font-medium capitalize mb-1'>
                  {message.role === 'user' ? 'Caller' : 'Agent'}
                </span>
                <div className='rounded-md px-4 py-2 max-w-[85%] bg-muted'>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
