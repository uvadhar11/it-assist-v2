import { CallSession, Ticket, TranscriptUpdate } from '@/types/api';

// Base API URL - can be configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

// For static builds, we need to handle API requests differently
const isStaticBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Helper function to make API requests with proper CORS settings
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Default options for CORS
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Add any auth headers if needed
    },
    // Add other default options as needed
  };

  // Merge the default options with the provided options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Active calls
export async function getActiveCalls(): Promise<CallSession[]> {
  // For static builds, return empty array or mock data
  if (isStaticBuild) {
    console.log(
      'Static build detected, returning placeholder data for getActiveCalls',
    );
    return [];
  }

  try {
    const data = await apiRequest('/api/calls/active');
    return data.calls || [];
  } catch (error) {
    console.error('Failed to fetch active calls:', error);
    return [];
  }
}

// Tickets
export async function getAllTickets(): Promise<Ticket[]> {
  // For static builds, return empty array or mock data
  if (isStaticBuild) {
    console.log(
      'Static build detected, returning placeholder data for getAllTickets',
    );
    return [];
  }

  try {
    const data = await apiRequest('/api/tickets');
    return data.tickets || [];
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return [];
  }
}

export async function getTicketById(ticketId: string): Promise<Ticket> {
  const data = await apiRequest(`/api/tickets/${ticketId}`);
  return data.ticket;
}

export async function closeTicket(
  ticketId: string,
  resolution: string,
): Promise<void> {
  await apiRequest(`/api/tickets/${ticketId}/close`, {
    method: 'POST',
    body: JSON.stringify({ resolution }),
  });
}

// WebSocket connection for real-time transcript updates
export function connectToCallWebSocket(
  callId: string,
  onUpdate: (data: TranscriptUpdate) => void,
) {
  const wsURL = `ws://${API_BASE_URL.replace(
    /^https?:\/\//,
    '',
  )}/frontend-ws/${callId}`;

  console.log(`Connecting to WebSocket at: ${wsURL}`);

  const socket = new WebSocket(wsURL);

  socket.onopen = () => {
    console.log(`WebSocket connection established for call: ${callId}`);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      if (data.type === 'transcript_update') {
        onUpdate(data);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = (event) => {
    console.log(
      `WebSocket connection closed for call ${callId}:`,
      event.code,
      event.reason,
    );
  };

  // Return function to close connection
  return () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };
}
