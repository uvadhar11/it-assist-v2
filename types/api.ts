// Types for API responses and data structures

// Call Session
export interface CallSession {
  call_id: string;
  agent_id: string;
  start_time: string;
  caller_number: string;
  last_activity: string;
  duration: number;
  is_active: boolean;
  ticket_id?: string;
  summary?: string;
  suggestions?: Suggestion[];
  transcript?: Transcript[];
}

// Transcript message
export interface Transcript {
  role: string;
  content: string;
  time: string;
}

// Suggestion for resolutions
export interface Suggestion {
  title: string;
  description: string;
}

// Ticket
export interface Ticket {
  ticket_id: string;
  call_id: string;
  agent_id: string;
  caller_number: string;
  status: 'open' | 'closed' | 'pending';
  created_at: string;
  updated_at: string;
  closed_at?: string;
  transcript?: Transcript[];
  transcript_string?: string;
  summary?: string;
  suggestions?: Suggestion[];
}

// WebSocket transcript update message
export interface TranscriptUpdate {
  type: string;
  call_id: string;
  agent_id: string;
  transcript: Transcript[];
  start_time: string;
  last_updated: string;
  is_active: boolean;
  ticket_id?: string;
  summary?: string;
  suggestions?: Suggestion[];
}

// Other API response types as needed
export interface ApiResponse {
  status: string;
  message?: string;
  [key: string]: any;
}
