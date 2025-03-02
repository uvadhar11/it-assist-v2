import { CallSession, Ticket, TranscriptUpdate } from '@/types/api';

// Base API URL - update to explicitly point to localhost:8081
const API_BASE_URL = 'http://localhost:8081';

// For static builds, we need to handle API requests differently
const isStaticBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Helper function to make API requests with proper CORS settings
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`Making API request to: ${url}`);

  // Default options for CORS
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors', // Explicitly set CORS mode
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

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API Request Error to ${url}:`, error);
    throw error;
  }
}

// Active calls
export async function getActiveCalls(): Promise<CallSession[]> {
  // For static builds, return empty array or mock data
  if (isStaticBuild) {
    console.log(
      'Static build detected, returning placeholder data for getActiveCalls',
    );
    return getMockActiveCalls();
  }

  try {
    const data = await apiRequest('/api/calls/active');
    return data.calls || [];
  } catch (error) {
    console.error('Failed to fetch active calls:', error);
    return getMockActiveCalls();
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
  try {
    const data = await apiRequest(`/api/tickets/${ticketId}`);
    return data.ticket;
  } catch (error) {
    console.error(`Failed to fetch ticket ${ticketId}:`, error);
    return getMockTicketById(ticketId);
  }
}

export async function closeTicket(
  ticketId: string,
  resolution: string,
): Promise<void> {
  try {
    await apiRequest(`/api/tickets/${ticketId}/close`, {
      method: 'POST',
      body: JSON.stringify({ resolution }),
    });
  } catch (error) {
    console.error(`Failed to close ticket ${ticketId}:`, error);
    throw error;
  }
}

// WebSocket connection for real-time transcript updates
export function connectToCallWebSocket(
  callId: string,
  onUpdate: (data: TranscriptUpdate) => void,
) {
  // Update to use the correct WebSocket URL with correct host
  const wsURL = `ws://localhost:8081/frontend-ws/${callId}`;

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

// Get a specific call by ID
export async function getCallById(callId: string) {
  try {
    const data = await apiRequest(`/api/calls/${callId}`);
    return data.call;
  } catch (error) {
    console.error(`API error fetching call ${callId}:`, error);
    return getMockCallById(callId);
  }
}

// Mock data functions
function getMockActiveCalls() {
  return [
    {
      call_id: '1A3244FC3D1WO',
      agent_id: 'agent-001',
      start_time: new Date().toISOString(),
      caller_number: '(555) 123-4567',
      last_activity: new Date().toISOString(),
      duration: 120,
      ticket_id: 'T-1234',
      summary: 'User having trouble with account login',
      is_active: true,
    },
    // ...other mock calls
  ];
}

function getMockTickets() {
  return [
    {
      ticket_id: 'T-1234',
      call_id: '1A3244FC3D1WO',
      agent_id: 'agent-001',
      caller_number: '(555) 123-4567',
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      summary: 'Unable to update the account settings',
    },
    // ...other mock tickets
  ];
}

function getMockTicketById(ticketId: string): Ticket {
  const mockTicket: Ticket = {
    ticket_id: ticketId,
    call_id: '1A3244FC3D1WO',
    agent_id: 'agent-001',
    caller_number: '(555) 123-4567',
    status: 'open', // This is now correctly typed as "open" | "closed" | "pending"
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    summary: 'Unable to update the account settings',
  };

  return mockTicket;
}

function getMockCallById(callId: string) {
  const mockCall = {
    call_id: callId,
    agent_id: 'agent-001',
    start_time: new Date().toISOString(),
    caller_number: '(555) 123-4567',
    last_activity: new Date().toISOString(),
    duration: 120,
    ticket_id: 'T-1234',
    is_active: true,
    summary:
      'Customer reported issues with their recently purchased software. The application crashes when attempting to import large files.',
    transcript: [
      {
        role: 'agent',
        content: 'Thank you for calling support. How can I help you today?',
        time: '00:12',
      },
      {
        role: 'user',
        content:
          "Hi, I'm having trouble with your software. It keeps crashing when I try to import my files.",
        time: '00:18',
      },
      {
        role: 'agent',
        content:
          "I'm sorry to hear that. Can you tell me more about when this happens?",
        time: '00:25',
      },
      {
        role: 'user',
        content:
          'It only happens with larger files, around 100MB or more. Smaller files work fine.',
        time: '00:32',
      },
      {
        role: 'agent',
        content: 'I see. And does it show any error message when it crashes?',
        time: '00:45',
      },
      {
        role: 'user',
        content:
          "Yes, something about memory allocation. I've already tried reinstalling it.",
        time: '00:52',
      },
    ],
    suggestions: [
      {
        title: 'Known Issue: Memory Allocation',
        description:
          'This appears to match known issue #4872. The development team has a fix scheduled for the next release.',
      },
      {
        title: 'Suggested Workaround',
        description:
          'Recommend splitting large files into smaller chunks before import. Our documentation has a guide for this process.',
      },
      {
        title: 'Similar Tickets',
        description:
          '3 similar tickets were resolved in the past week. Check related solutions.',
      },
    ],
  };

  return mockCall;
}
