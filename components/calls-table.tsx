'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getActiveCalls } from '@/lib/api';

/**
 * Call interface defines the structure of a call object based on backend schema
 * @property call_id - Unique identifier for the call
 * @property agent_id - ID of the agent assigned to the call
 * @property start_time - Timestamp when the call started
 * @property caller_number - Phone number of the caller
 * @property last_activity - Timestamp of the last activity on the call
 * @property duration - Duration of the call in seconds
 * @property ticket_id - ID of the associated ticket
 * @property summary - Summary of the call
 */
interface Call {
  call_id: string;
  agent_id: string;
  start_time: string;
  caller_number: string;
  last_activity: string;
  duration: number;
  ticket_id?: string;
  summary?: string;
}

/**
 * CallTableProps interface defines the properties for the call table component
 * @param searchQuery - Current search query for filtering calls
 * @param dateRange - Current date range for filtering calls
 */
interface CallTableProps {
  searchQuery: string;
  dateRange: string | undefined;
}

export function CallTable({ searchQuery, dateRange }: CallTableProps) {
  // State to hold calls fetched from the backend API
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch calls from the backend
  useEffect(() => {
    async function fetchCalls() {
      try {
        setLoading(true);
        // Use the API client instead of direct fetch
        const fetchedCalls = await getActiveCalls();
        setCalls(fetchedCalls);
      } catch (err) {
        console.error('Failed to fetch calls:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        // Set some dummy data for development purposes
        setCalls([
          {
            call_id: '1A3244FC3D1WO',
            agent_id: 'agent-001',
            start_time: new Date().toISOString(),
            caller_number: '(555) 123-4567',
            last_activity: new Date().toISOString(),
            duration: 120,
            ticket_id: 'T-1234',
            summary: 'User having trouble with account login',
          },
          {
            call_id: '12T9UAHF3KDF',
            agent_id: 'agent-002',
            start_time: new Date().toISOString(),
            caller_number: '(555) 987-6543',
            last_activity: new Date().toISOString(),
            duration: 45,
            ticket_id: 'T-1235',
          },
          {
            call_id: 'C-9876',
            agent_id: 'agent-003',
            start_time: new Date().toISOString(),
            caller_number: '(555) 555-5555',
            last_activity: new Date().toISOString(),
            duration: 180,
            ticket_id: 'T-1236',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchCalls();
    // Poll for updates every 30 seconds to keep active calls list fresh
    const interval = setInterval(fetchCalls, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Filter calls based on search query and date range
   * Uses useMemo to avoid recalculating on every render
   */
  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      // Filter by search query (call ID or agent ID or caller number)
      const matchesSearch =
        searchQuery === '' ||
        call.call_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.agent_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.caller_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (call.summary &&
          call.summary.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by date range - convert ISO timestamps to readable format
      const callDate = new Date(call.start_time).toLocaleDateString();
      const matchesDate = !dateRange || callDate.includes(dateRange);

      // Only include calls that match both filters
      return matchesSearch && matchesDate;
    });
  }, [calls, searchQuery, dateRange]);

  // Function to format duration as "MM:SS"
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to format date in a readable way
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className='border rounded-md'>
      {loading ? (
        <div className='p-4 text-center'>Loading calls...</div>
      ) : error ? (
        <div className='p-4 text-center text-red-500'>
          <p>Error: {error}</p>
          <p className='text-sm text-gray-500 mt-2'>
            Using sample data for demonstration
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='pl-[50px]'>Call ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Ticket</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCalls.length > 0 ? (
              filteredCalls.map((call) => (
                <TableRow key={call.call_id}>
                  <TableCell className='font-medium pl-[50px]'>
                    <Link href={`/calls/${call.call_id}`}>{call.call_id}</Link>
                  </TableCell>
                  <TableCell>{call.agent_id}</TableCell>
                  <TableCell>{call.caller_number}</TableCell>
                  <TableCell>{formatDate(call.start_time)}</TableCell>
                  <TableCell>{formatDuration(call.duration)}</TableCell>
                  <TableCell>
                    {call.ticket_id ? (
                      <Link
                        href={`/tickets/${call.ticket_id}`}
                        className='text-blue-600 hover:underline'
                      >
                        {call.ticket_id}
                      </Link>
                    ) : (
                      <span className='text-gray-400'>Not assigned</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-4'>
                  No active calls found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
