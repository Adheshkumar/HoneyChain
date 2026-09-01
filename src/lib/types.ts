export type Role = 'beekeeper' | 'officer' | 'consumer';

export type VerificationLevel =
  | 'SELF_REPORTED'
  | 'USER_CONFIRMED'
  | 'EVIDENCE_SUPPORTED'
  | 'SUPERVISOR_VERIFIED';

export type HiveStatus = 'Healthy' | 'Attention' | 'Critical';

export interface Beekeeper {
  id: string;
  name: string;
  fpo: string;
  membershipId: string;
  location: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface Hive {
  id: string;
  beekeeperId: string;
  apiary: string;
  cluster: string;
  status: HiveStatus;
  temperature: number;
  humidity: number;
  weight: number;
  activity: 'Normal' | 'Low' | 'High';
  registeredAt: string;
}

export interface Harvest {
  id: string;
  beekeeperId: string;
  hiveId: string;
  quantityKg: number;
  date: string;
  verification: VerificationLevel;
  batchId: string;
  iot: {
    weightBefore: number;
    weightAfter: number;
    observedChange: number;
    temperature: number;
    humidity: number;
  };
  aiConfidence: number;
  aiAnalysis: string;
}

export interface BatchEvent {
  label: string;
  date: string;
  detail: string;
  icon: string;
}

export interface Batch {
  id: string;
  origin: string;
  sourceHives: { hiveId: string; quantityKg: number }[];
  totalKg: number;
  status: 'VERIFIED' | 'PROCESSING' | 'PENDING';
  events: BatchEvent[];
  blockIds: number[];
}

export interface Block {
  index: number;
  event: string;
  batchId: string;
  prevHash: string;
  hash: string;
  timestamp: string;
  payload: string;
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  kind?: 'text' | 'voice' | 'extraction' | 'verification' | 'quick-reply';
  quickReplies?: string[];
  extraction?: ExtractedInfo;
}

export interface ExtractedInfo {
  hiveId?: string;
  event?: string;
  quantity?: number;
  unit?: string;
  date?: string;
  language?: string;
  confidence: number;
  missing: string[];
}
