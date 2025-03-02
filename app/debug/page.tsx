import { DebugCors } from '@/components/debug-cors';

export const metadata = {
  title: 'Debug Connection Issues',
  description: 'Debug API and WebSocket connection issues',
};

export default function DebugPage() {
  return (
    <div className='container mx-auto py-10 space-y-6'>
      <h1 className='text-2xl font-bold'>Debug Connection Issues</h1>

      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <DebugCors />
        </div>

        <div className='space-y-4'>
          <div className='bg-card border rounded-lg p-4'>
            <h2 className='font-semibold mb-2'>Environment Settings</h2>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <span className='font-medium'>API URL:</span>
              <span className='font-mono'>
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}
              </span>
              <span className='font-medium'>Node Environment:</span>
              <span className='font-mono'>{process.env.NODE_ENV}</span>
            </div>
          </div>

          <div className='bg-card border rounded-lg p-4'>
            <h2 className='font-semibold mb-2'>Common CORS Issues</h2>
            <ul className='list-disc pl-5 space-y-2 text-sm'>
              <li>
                Backend not configured to allow requests from your frontend
                origin
              </li>
              <li>WebSocket connection attempted with incorrect URL format</li>
              <li>Missing CORS headers in server responses</li>
              <li>
                Credentials mode incompatible with Access-Control-Allow-Origin
                settings
              </li>
              <li>Preflight OPTIONS requests not handled correctly</li>
            </ul>
          </div>

          <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
            <h2 className='font-semibold mb-2 text-amber-800'>
              Troubleshooting Steps
            </h2>
            <ol className='list-decimal pl-5 space-y-2 text-sm text-amber-800'>
              <li>Ensure the Go backend has CORS middleware configured</li>
              <li>
                Check that your frontend origin is in the allowed origins list
              </li>
              <li>Verify that the API URL in .env.local is correct</li>
              <li>Try disabling credentials mode for testing</li>
              <li>Check browser console for specific CORS error messages</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
