import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  PhoneIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  ArrowLeft,
} from 'lucide-react';
import CallAssistantInterface from '@/components/ui/call-assistant';
import { getActiveCalls } from '@/lib/api';
import { CallDetailsContent } from '@/components/call-details-content';

export const metadata: Metadata = {
  title: 'Call Details',
  description: 'View live call transcription and analysis',
};

// This function generates the static paths at build time
export async function generateStaticParams() {
  try {
    // For static export, we need to fetch active calls
    const calls = await getActiveCalls();

    // Return call IDs as params
    return calls.map((call) => ({
      callId: call.call_id,
    }));
  } catch (error) {
    console.error('Error fetching calls for static generation:', error);
    // Return an empty array as fallback
    return [];
  }
}

export default function CallDetailPage({
  params,
}: {
  params: { callId: string };
}) {
  const callId = params.callId;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 w-screen bg-[url('/gradient.png')] bg-cover bg-center">
      <div className='bg-opacity-40 bg-[length:110%] mx-auto px-24'>
        {/* Breadcrumbs */}
        <div className='flex items-center gap-2 text-sm text-[#5e646e] w-[1350px] py-4'>
          <Link href='/calls'>
            <span>Active Calls</span>
          </Link>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-chevron-right'
          >
            <path d='m9 18 6-6-6-6' />
          </svg>
          <span>Call ID: {callId}</span>
        </div>

        {/* Main content */}
        <div className='bg-offwhite w-full h-full flex-1 p-6 rounded-lg'>
          <CallDetailsContent callId={callId} />
        </div>
      </div>
    </main>
  );
}

// Add fallback for routes not generated at build time
export const dynamicParams = true;
