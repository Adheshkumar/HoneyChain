import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Beekeeper, Hive, Harvest, Batch, Block, BatchEvent } from './types';
import * as mock from './mockData';
import { createBlock, computeBlockHash } from './blockchain';
import { supabase } from './supabaseClient';

interface StoreState {
  beekeepers: Beekeeper[];
  hives: Hive[];
  harvests: Harvest[];
  batches: Batch[];
  blocks: Block[];

  loading: boolean;
  error: string | null;

  verifyBeekeeper: (id: string) => Promise<void>;
  rejectBeekeeper: (id: string) => Promise<void>;
  addHive: (hive: Omit<Hive, 'registeredAt' | 'beekeeperId'> & { beekeeperId?: string }) => Promise<void>;

  addHarvest: (h: Harvest) => Promise<void>;
  appendBlock: (event: string, batchId: string, payload: string) => Promise<void>;
  refreshBlocks: () => Promise<void>;
}

const StoreContext = createContext<StoreState | null>(null);

function mapBeekeeper(row: Record<string, unknown>): Beekeeper {
  return {
    id: row.id as string,
    name: row.name as string,
    fpo: (row.fpo_name as string) || '',
    membershipId: (row.membership_id as string) || '',
    location: (row.location as string) || '',
    status: (row.status as string) as Beekeeper['status'],
    verifiedAt: row.verified_at as string | undefined,
    verifiedBy: row.verified_by as string | undefined,
  };
}

function mapHive(row: Record<string, unknown>, sensor?: Record<string, unknown> | null): Hive {
  return {
    id: row.id as string,
    beekeeperId: row.beekeeper_id as string,
    apiary: (row.apiary_name as string) || '',
    cluster: (row.cluster as string) || '',
    status: (row.status as string) as Hive['status'],
    temperature: sensor ? parseFloat(String(sensor.temperature)) : 0,
    humidity: sensor ? parseFloat(String(sensor.humidity)) : 0,
    weight: sensor ? parseFloat(String(sensor.weight)) : 0,
    activity: (row.activity as string) as Hive['activity'],
    registeredAt: (row.registered_at as string) || '',
  };
}

function mapHarvest(row: Record<string, unknown>): Harvest {
  return {
    id: row.id as string,
    beekeeperId: row.beekeeper_id as string,
    hiveId: row.hive_id as string,
    quantityKg: parseFloat(String(row.quantity_kg)),
    date: (row.harvest_date as string) || '',
    verification: (row.verification as string) as Harvest['verification'],
    batchId: (row.batch_id as string) || '',
    iot: {
      weightBefore: parseFloat(String(row.iot_weight_before || 0)),
      weightAfter: parseFloat(String(row.iot_weight_after || 0)),
      observedChange: parseFloat(String(row.iot_observed_change || 0)),
      temperature: parseFloat(String(row.iot_temperature || 0)),
      humidity: parseFloat(String(row.iot_humidity || 0)),
    },
    aiConfidence: (row.ai_confidence as number) || 0,
    aiAnalysis: (row.ai_analysis as string) || '',
  };
}

function mapBatch(
  row: Record<string, unknown>,
  sourceHives: { hiveId: string; quantityKg: number }[],
  events: BatchEvent[],
  blockIds: number[],
): Batch {
  return {
    id: row.id as string,
    origin: (row.origin as string) || '',
    sourceHives,
    totalKg: parseFloat(String(row.total_quantity_kg || 0)),
    status: (row.status as string) as Batch['status'],
    events,
    blockIds,
  };
}

function mapBlock(row: Record<string, unknown>): Block {
  return {
    index: (row.block_index as number) || 0,
    event: (row.event_type as string) || '',
    batchId: (row.batch_id as string) || '',
    prevHash: (row.previous_hash as string) || 'GENESIS',
    hash: (row.current_hash as string) || '',
    timestamp: (row.event_timestamp as string) || '',
    payload: (row.payload as string) || '',
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [beekeepers, setBeekeepers] = useState<Beekeeper[]>(mock.beekeepers);
  const [hives, setHives] = useState<Hive[]>(mock.hives);
  const [harvests, setHarvests] = useState<Harvest[]>(mock.harvests);
  const [batches, setBatches] = useState<Batch[]>(mock.batches);
  const [blocks, setBlocks] = useState<Block[]>(mock.initialBlocks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bkRes, hiveRes, sensorRes, harvestRes, batchRes, sourceRes, traceRes, blockRes] = await Promise.all([
        supabase.from('beekeepers').select('*').order('created_at'),
        supabase.from('hives').select('*').order('id'),
        supabase.from('hive_sensor_readings').select('*').order('created_at', { ascending: false }),
        supabase.from('harvests').select('*').order('created_at', { ascending: false }),
        supabase.from('honey_batches').select('*').order('created_at'),
        supabase.from('batch_source_hives').select('*'),
        supabase.from('traceability_events').select('*').order('event_order'),
        supabase.from('blockchain_events').select('*').order('block_index'),
      ]);

      if (bkRes.error) throw bkRes.error;
      if (hiveRes.error) throw hiveRes.error;
      if (sensorRes.error) throw sensorRes.error;
      if (harvestRes.error) throw harvestRes.error;
      if (batchRes.error) throw batchRes.error;
      if (sourceRes.error) throw sourceRes.error;
      if (traceRes.error) throw traceRes.error;
      if (blockRes.error) throw blockRes.error;

      const sensorMap = new Map<string, Record<string, unknown>>();
      for (const s of (sensorRes.data || []) as Record<string, unknown>[]) {
        const hid = s.hive_id as string;
        if (!sensorMap.has(hid)) sensorMap.set(hid, s);
      }

      const mappedHives = (hiveRes.data || []).map((h) =>
        mapHive(h as Record<string, unknown>, sensorMap.get((h as Record<string, unknown>).id as string)),
      );
      setHives(mappedHives);

      setBeekeepers((bkRes.data || []).map(mapBeekeeper));
      setHarvests((harvestRes.data || []).map(mapHarvest));

      // Map batches with source hives and events
      const sourceMap = new Map<string, { hiveId: string; quantityKg: number }[]>();
      for (const s of (sourceRes.data || []) as Record<string, unknown>[]) {
        const bid = s.batch_id as string;
        if (!sourceMap.has(bid)) sourceMap.set(bid, []);
        sourceMap.get(bid)!.push({ hiveId: s.hive_id as string, quantityKg: parseFloat(String(s.quantity_kg)) });
      }

      const traceMap = new Map<string, BatchEvent[]>();
      for (const t of (traceRes.data || []) as Record<string, unknown>[]) {
        const bid = t.batch_id as string;
        if (!traceMap.has(bid)) traceMap.set(bid, []);
        traceMap.get(bid)!.push({
          label: t.event_label as string,
          date: t.event_date as string,
          detail: (t.event_detail as string) || '',
          icon: (t.event_icon as string) || '📦',
        });
      }

      const blockMap = new Map<string, number[]>();
      for (const b of (blockRes.data || []) as Record<string, unknown>[]) {
        const bid = b.batch_id as string;
        if (!blockMap.has(bid)) blockMap.set(bid, []);
        blockMap.get(bid)!.push((b.block_index as number) || 0);
      }

      const mappedBatches = (batchRes.data || []).map((b) =>
        mapBatch(
          b as Record<string, unknown>,
          sourceMap.get((b as Record<string, unknown>).id as string) || [],
          traceMap.get((b as Record<string, unknown>).id as string) || [],
          blockMap.get((b as Record<string, unknown>).id as string) || [],
        ),
      );
      setBatches(mappedBatches);

      // Recalculate blockchain hashes if they are placeholders
      const mappedBlocks = (blockRes.data || []).map(mapBlock);
      const hasPlaceholders = mappedBlocks.some((b) => b.hash === 'PLACEHOLDER' || b.prevHash === 'PLACEHOLDER');
      if (hasPlaceholders && mappedBlocks.length > 0) {
        const recalculated = await recalculateChain(mappedBlocks);
        setBlocks(recalculated);
        // Persist recalculated hashes
        for (const b of recalculated) {
          await supabase.from('blockchain_events')
            .update({ current_hash: b.hash, previous_hash: b.prevHash, event_data_hash: b.hash })
            .eq('block_index', b.index);
        }
      } else {
        setBlocks(mappedBlocks);
      }
    } catch (err) {
      console.error('Store fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const verifyBeekeeper = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('beekeepers')
      .update({ status: 'VERIFIED', verified_at: new Date().toISOString(), verified_by: 'FPO Officer — Karnataka' })
      .eq('id', id);
    if (error) { setError(error.message); return; }
    setBeekeepers((prev) => prev.map((b) => b.id === id ? { ...b, status: 'VERIFIED', verifiedAt: new Date().toISOString(), verifiedBy: 'FPO Officer — Karnataka' } : b));
  }, []);

  const rejectBeekeeper = useCallback(async (id: string) => {
    const { error } = await supabase.from('beekeepers').update({ status: 'REJECTED' }).eq('id', id);
    if (error) { setError(error.message); return; }
    setBeekeepers((prev) => prev.map((b) => b.id === id ? { ...b, status: 'REJECTED' } : b));
  }, []);

  const addHive = useCallback(async (hive: Omit<Hive, 'registeredAt' | 'beekeeperId'> & { beekeeperId?: string }) => {
    const bid = hive.beekeeperId || 'BK-001';
    const { error } = await supabase.from('hives').insert({
      id: hive.id,
      beekeeper_id: bid,
      apiary_name: hive.apiary,
      cluster: hive.cluster,
      registration_status: 'VERIFIED',
      registered_by: 'FPO Officer',
      status: hive.status,
      activity: hive.activity,
    });
    if (error) { setError(error.message); return; }
    // Insert sensor reading
    await supabase.from('hive_sensor_readings').insert({
      hive_id: hive.id,
      temperature: hive.temperature,
      humidity: hive.humidity,
      weight: hive.weight,
      is_simulated: true,
    });
    setHives((prev) => [...prev, { ...hive, beekeeperId: bid, registeredAt: new Date().toISOString().slice(0, 10) }]);
  }, []);

  const addHarvest = useCallback(async (h: Harvest) => {
    const { error } = await supabase.from('harvests').insert({
      id: h.id,
      beekeeper_id: h.beekeeperId,
      hive_id: h.hiveId,
      quantity_kg: h.quantityKg,
      harvest_date: h.date,
      verification: h.verification,
      batch_id: h.batchId,
      iot_weight_before: h.iot.weightBefore,
      iot_weight_after: h.iot.weightAfter,
      iot_observed_change: h.iot.observedChange,
      iot_temperature: h.iot.temperature,
      iot_humidity: h.iot.humidity,
      ai_confidence: h.aiConfidence,
      ai_analysis: h.aiAnalysis,
    });
    if (error) { setError(error.message); return; }
    setHarvests((prev) => [h, ...prev]);
  }, []);

  const appendBlock = useCallback(async (event: string, batchId: string, payload: string) => {
    const lastBlock = blocks[blocks.length - 1];
    const newIndex = (lastBlock?.index || 0) + 1;
    const prevHash = lastBlock?.hash || 'GENESIS';
    const block = await createBlock(newIndex, prevHash, event, batchId, payload);

    const { error } = await supabase.from('blockchain_events').insert({
      block_index: block.index,
      event_type: block.event,
      batch_id: block.batchId,
      event_timestamp: block.timestamp,
      event_data_hash: block.hash,
      previous_hash: block.prevHash,
      current_hash: block.hash,
      payload: block.payload,
    });
    if (error) { setError(error.message); return; }
    setBlocks((prev) => [...prev, block]);
  }, [blocks]);

  const refreshBlocks = useCallback(async () => {
    const { data, error } = await supabase.from('blockchain_events').select('*').order('block_index');
    if (error) { setError(error.message); return; }
    setBlocks((data || []).map(mapBlock));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        beekeepers,
        hives,
        harvests,
        batches,
        blocks,
        loading,
        error,
        verifyBeekeeper,
        rejectBeekeeper,
        addHive,
        addHarvest,
        appendBlock,
        refreshBlocks,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

async function recalculateChain(blocks: Block[]): Promise<Block[]> {
  const result: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const prevHash = i === 0 ? 'GENESIS' : result[i - 1].hash;
    const hash = await computeBlockHash(blocks[i].index, prevHash, blocks[i].event, blocks[i].batchId, blocks[i].timestamp, blocks[i].payload);
    result.push({ ...blocks[i], prevHash, hash });
  }
  return result;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
