import type { Beekeeper, Hive, Harvest, Batch, Block } from './types';

export const beekeepers: Beekeeper[] = [
  {
    id: 'BK-001',
    name: 'Ramesh Kumar',
    fpo: 'Mysuru Honey Producers FPO',
    membershipId: 'FPO-1023',
    location: 'Karnataka',
    status: 'VERIFIED',
    verifiedAt: '2026-08-15T10:30:00',
    verifiedBy: 'FPO Officer — Karnataka',
  },
  {
    id: 'BK-002',
    name: 'Lakshmi Devi',
    fpo: 'Mysuru Honey Producers FPO',
    membershipId: 'FPO-1024',
    location: 'Karnataka',
    status: 'PENDING',
  },
  {
    id: 'BK-003',
    name: 'Suresh Patel',
    fpo: 'Gujarat Beekeepers FPO',
    membershipId: 'FPO-2017',
    location: 'Gujarat',
    status: 'VERIFIED',
    verifiedAt: '2026-07-22T09:00:00',
    verifiedBy: 'FPO Officer — Gujarat',
  },
];

export const hives: Hive[] = [
  {
    id: '12',
    beekeeperId: 'BK-001',
    apiary: 'Mysuru Cluster A',
    cluster: 'Mysuru',
    status: 'Healthy',
    temperature: 35.8,
    humidity: 72,
    weight: 42.1,
    activity: 'Normal',
    registeredAt: '2026-08-15',
  },
  {
    id: '15',
    beekeeperId: 'BK-001',
    apiary: 'Mysuru Cluster A',
    cluster: 'Mysuru',
    status: 'Attention',
    temperature: 38.2,
    humidity: 81,
    weight: 39.4,
    activity: 'Low',
    registeredAt: '2026-08-15',
  },
  {
    id: '20',
    beekeeperId: 'BK-001',
    apiary: 'Mysuru Cluster A',
    cluster: 'Mysuru',
    status: 'Healthy',
    temperature: 34.9,
    humidity: 68,
    weight: 51.8,
    activity: 'Normal',
    registeredAt: '2026-08-15',
  },
];

export const harvests: Harvest[] = [
  {
    id: 'H001',
    beekeeperId: 'BK-001',
    hiveId: '12',
    quantityKg: 3,
    date: '2026-09-01',
    verification: 'EVIDENCE_SUPPORTED',
    batchId: 'HC-001',
    iot: {
      weightBefore: 45.2,
      weightAfter: 42.1,
      observedChange: 3.1,
      temperature: 35.8,
      humidity: 72,
    },
    aiConfidence: 94,
    aiAnalysis: 'Reported harvest quantity is consistent with simulated hive-weight evidence.',
  },
];

export const batches: Batch[] = [
  {
    id: 'HC-001',
    origin: 'Karnataka',
    sourceHives: [
      { hiveId: '12', quantityKg: 3 },
      { hiveId: '15', quantityKg: 4 },
      { hiveId: '20', quantityKg: 3 },
    ],
    totalKg: 10,
    status: 'VERIFIED',
    events: [
      { label: 'HARVESTED', date: '01 Sep 2026', detail: '3 kg from Hive 12', icon: '🍯' },
      { label: 'COLLECTION COMPLETED', date: '02 Sep 2026', detail: 'Mysuru Collection Centre', icon: '📦' },
      { label: 'PROCESSING COMPLETED', date: '03 Sep 2026', detail: 'Filtered & standardised', icon: '🏭' },
      { label: 'QUALITY VERIFIED', date: '04 Sep 2026', detail: 'Moisture 18.2% — within standard', icon: '🔬' },
      { label: 'PACKAGE CREATED', date: '05 Sep 2026', detail: '500 ml jars × 20', icon: '📦' },
    ],
    blockIds: [1, 2, 3, 4],
  },
];

export const initialBlocks: Block[] = [
  {
    index: 1,
    event: 'HARVEST_CONFIRMED',
    batchId: 'HC-001',
    prevHash: 'GENESIS',
    hash: '8F31C8A492BD',
    timestamp: '2026-09-01T08:15:00',
    payload: 'hive=12|qty=3kg|beekeeper=BK-001|verification=EVIDENCE_SUPPORTED',
  },
  {
    index: 2,
    event: 'COLLECTION_COMPLETED',
    batchId: 'HC-001',
    prevHash: '8F31C8A492BD',
    hash: 'A71D92F31C44',
    timestamp: '2026-09-02T11:00:00',
    payload: 'centre=Mysuru|batch=HC-001',
  },
  {
    index: 3,
    event: 'QUALITY_VERIFIED',
    batchId: 'HC-001',
    prevHash: 'A71D92F31C44',
    hash: 'C82FA912BB71',
    timestamp: '2026-09-04T14:30:00',
    payload: 'moisture=18.2|grade=A|batch=HC-001',
  },
  {
    index: 4,
    event: 'PACKAGE_CREATED',
    batchId: 'HC-001',
    prevHash: 'C82FA912BB71',
    hash: 'D93AC821F711',
    timestamp: '2026-09-05T16:45:00',
    payload: 'jars=20|size=500ml|batch=HC-001',
  },
];

export const dashboardStats = {
  totalBeekeepers: 48,
  verifiedBeekeepers: 43,
  activeHives: 148,
  honeyProducedKg: 326,
  verifiedBatches: 28,
  alerts: 4,
};

export const productionTimeline = [
  { month: 'Apr', kg: 28 },
  { month: 'May', kg: 42 },
  { month: 'Jun', kg: 56 },
  { month: 'Jul', kg: 38 },
  { month: 'Aug', kg: 64 },
  { month: 'Sep', kg: 98 },
];

export const hiveHealthData = [
  { label: 'Healthy', count: 132, color: '#43ad68' },
  { label: 'Attention', count: 12, color: '#e09a2b' },
  { label: 'Critical', count: 4, color: '#dc2626' },
];

export const recentActivity = [
  {
    beekeeperId: 'BK-001',
    action: 'Harvest recorded',
    detail: 'Hive 12 · 3 kg',
    status: 'Evidence Supported',
    time: '2 min ago',
  },
  {
    beekeeperId: 'BK-003',
    action: 'Hive registered',
    detail: 'Hive 34 · Gujarat',
    status: 'Verified',
    time: '18 min ago',
  },
  {
    beekeeperId: 'BK-001',
    action: 'Inspection reported',
    detail: 'Hive 15 · Attention',
    status: 'Flagged',
    time: '1 hr ago',
  },
  {
    beekeeperId: 'BK-002',
    action: 'Onboarding submitted',
    detail: 'Pending verification',
    status: 'Pending',
    time: '3 hr ago',
  },
];
