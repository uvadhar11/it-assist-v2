'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function DebugCors() {
  const [apiStatus, setApiStatus] = useState<string>('Not tested');
  const [wsStatus, setWsStatus] = useState<string>('Not tested');
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<string>('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  const testApiConnection = async () => {
    setLoading(true);
    setApiStatus('Testing...');

    try {
      const response = await fetch(`${API_URL}/api/calls/active`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setApiStatus('Success ✅');
        const data = await response.json();
        setDetails(
          `API responded with ${Object.keys(data).length} keys: ${Object.keys(
            data,
          ).join(', ')}`,
        );
      } else {
        setApiStatus(`Failed ❌ (Status: ${response.status})`);
        setDetails(`Error: ${response.statusText}`);
      }
    } catch (error) {
      setApiStatus('Error ❌');
      setDetails(
        `Exception: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const testWebSocketConnection = () => {
    setLoading(true);
    setWsStatus('Testing...');

    try {
      const wsUrl = `ws://${API_URL.replace(
        /^https?:\/\//,
        '',
      )}/frontend-ws/test-connection`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setWsStatus('Connection Successful ✅');
        setDetails('WebSocket connection established successfully');
        socket.close();
        setLoading(false);
      };

      socket.onerror = (error) => {
        setWsStatus('Connection Failed ❌');
        setDetails(`WebSocket error: ${JSON.stringify(error)}`);
        setLoading(false);
      };

      socket.onclose = (event) => {
        if (event.code !== 1000) {
          setWsStatus(`Closed with error: Code ${event.code} ❌`);
          setDetails(`Reason: ${event.reason || 'No reason provided'}`);
        }
        setLoading(false);
      };

      // Set a timeout in case the connection hangs
      setTimeout(() => {
        if (
          socket.readyState !== WebSocket.OPEN &&
          socket.readyState !== WebSocket.CLOSED
        ) {
          socket.close();
          setWsStatus('Connection Timeout ❌');
          setDetails('WebSocket connection attempt timed out after 5 seconds');
          setLoading(false);
        }
      }, 5000);
    } catch (error) {
      setWsStatus('Error ❌');
      setDetails(
        `Exception: ${error instanceof Error ? error.message : String(error)}`,
      );
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Connection Debugger</CardTitle>
        <CardDescription>
          Test connections to the backend API and WebSocket endpoints
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h3 className='font-medium mb-1'>REST API Status:</h3>
              <p
                className={`${
                  apiStatus.includes('✅')
                    ? 'text-green-600'
                    : apiStatus.includes('❌')
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                }`}
              >
                {apiStatus}
              </p>
            </div>
            <div>
              <h3 className='font-medium mb-1'>WebSocket Status:</h3>
              <p
                className={`${
                  wsStatus.includes('✅')
                    ? 'text-green-600'
                    : wsStatus.includes('❌')
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                }`}
              >
                {wsStatus}
              </p>
            </div>
          </div>

          {details && (
            <div className='bg-muted p-3 rounded-md overflow-auto max-h-32'>
              <pre className='text-xs whitespace-pre-wrap'>{details}</pre>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button onClick={testApiConnection} disabled={loading}>
          {loading && apiStatus === 'Testing...' && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          Test API
        </Button>
        <Button
          onClick={testWebSocketConnection}
          disabled={loading}
          variant='outline'
        >
          {loading && wsStatus === 'Testing...' && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          Test WebSocket
        </Button>
      </CardFooter>
    </Card>
  );
}
