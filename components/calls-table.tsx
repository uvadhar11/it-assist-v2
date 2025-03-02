'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getActiveCalls } from '@/lib/api';
import { CallSession } from '@/types/api';

interface CallTableProps {
  searchQuery: string;
  dateRange: string | undefined;
}

export function CallTable({ searchQuery, dateRange }: CallTableProps) {
  const [calls, setCalls] = useState<CallSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch calls from API
  useEffect(() => {
    async function fetchCalls() {
      try {
        const activeCalls = await getActiveCalls();
        setCalls(activeCalls);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch calls:', err);
        setError('Failed to load active calls');
        setLoading(false);
      }
    }

    fetchCalls();
    // Set up polling every 10 seconds to keep data fresh
    const interval = setInterval(fetchCalls, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter calls based on search query
  const filteredCalls = calls.filter((call) => {
    // Filter by search query (call ID or caller number)
    const matchesSearch =
      searchQuery === '' ||
      call.call_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (call.caller_number &&
        call.caller_number.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by date range - would need to implement based on how dateRange is formatted
    const matchesDate = !dateRange || true; // Implement date filtering logic if needed

    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className='flex justify-center items-center p-12'>
        <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (error) {
    return <div className='p-4 bg-red-50 text-red-700 rounded-md'>{error}</div>;
  }

  if (filteredCalls.length === 0) {
    return (
      <div className='border rounded-md p-6 text-center text-muted-foreground'>
        No active calls found.
      </div>
    );
  }

  return (
    <div className='border rounded-md'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Call ID</TableHead>
            <TableHead>Caller Number</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Agent ID</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCalls.map((call) => (
            <TableRow
              key={call.call_id}
              className='cursor-pointer hover:bg-accent/50'
            >
              <TableCell className='font-medium'>
                <Link href={`/calls/${call.call_id}`}>
                  {call.call_id.substring(0, 8)}...
                </Link>
              </TableCell>
              <TableCell>{call.caller_number || 'Unknown'}</TableCell>
              <TableCell>
                {format(new Date(call.start_time), 'MMM d, yyyy HH:mm')}
              </TableCell>
              <TableCell>
                {Math.floor(call.duration / 60)}:
                {String(Math.floor(call.duration % 60)).padStart(2, '0')}
              </TableCell>
              <TableCell>{call.agent_id}</TableCell>
              <TableCell>
                <span className='inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                  Active
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
