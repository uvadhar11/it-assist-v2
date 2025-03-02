export interface Transcript {
  role: string;
  content: string;
}

export interface Suggestion {
  title: string;
  description: string;
}

export interface CallSession {
  call_id: string;
  agent_id: string;
  start_time: string;
  caller_number: string;
  last_activity: string;
  duration: number;
  transcript?: Transcript[];
  summary?: string;
  suggestions?: Suggestion[];
  ticket_id?: string;
}

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
  summary?: string;
  suggestions?: Suggestion[];
}

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

export interface ConnectionResponse {
  type: string;
  status: string;
  message: string;
  call_id: string;
}
