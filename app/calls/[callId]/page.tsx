import { Metadata } from 'next';
import { CallViewer } from '@/components/call-viewer';
import { getActiveCalls } from '@/lib/api';

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

export default function CallPage({ params }: { params: { callId: string } }) {
  return (
    <div className='flex flex-col gap-6'>
      <CallViewer callId={params.callId} />
    </div>
  );
}

// Add fallback for routes not generated at build time
export const dynamicParams = true;
