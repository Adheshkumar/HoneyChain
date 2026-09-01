import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Beekeeper, Hive, Harvest, Batch, Block, BatchEvent } from './types';
import * as mock from './mockData';
import { createBlock, computeBlockHash } from './blockchain';

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
  addHive: (
    hive: Omit<Hive, 'registeredAt' | 'beekeeperId'> & { beekeeperId?: string }
  ) => Promise<void>;

  addHarvest: (h: Harvest) => Promise<void>;
  appendBlock: (event: string, batchId: string, payload: string) => Promise<void>;
  refreshBlocks: () => Promise<void>;
}

const StoreContext = createContext<StoreState | null>(null);

const STORAGE_KEY = 'honeychain_store_v1';

interface PersistedStore {
  beekeepers: Beekeeper[];
  hives: Hive[];
  harvests: Harvest[];
  batches: Batch[];
  blocks: Block[];
}

function loadStoredData(): PersistedStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);

      return {
        beekeepers: parsed.beekeepers || mock.beekeepers,
        hives: parsed.hives || mock.hives,
        harvests: parsed.harvests || mock.harvests,
        batches: parsed.batches || mock.batches,
        blocks: parsed.blocks || mock.initialBlocks,
      };
    }
  } catch (error) {
    console.error('Failed to load local HoneyChain data:', error);
  }

  return {
    beekeepers: mock.beekeepers,
    hives: mock.hives,
    harvests: mock.harvests,
    batches: mock.batches,
    blocks: mock.initialBlocks,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = loadStoredData();

  const [beekeepers, setBeekeepers] = useState<Beekeeper[]>(initial.beekeepers);
  const [hives, setHives] = useState<Hive[]>(initial.hives);
  const [harvests, setHarvests] = useState<Harvest[]>(initial.harvests);
  const [batches, setBatches] = useState<Batch[]>(initial.batches);
  const [blocks, setBlocks] = useState<Block[]>(initial.blocks);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Persist the complete prototype state locally.
   *
   * This replaces the previous Supabase dependency for the prototype.
   */
  useEffect(() => {
    try {
      const data: PersistedStore = {
        beekeepers,
        hives,
        harvests,
        batches,
        blocks,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save HoneyChain local data:', error);
    }
  }, [beekeepers, hives, harvests, batches, blocks]);

  /*
   * FPO verification
   */
  const verifyBeekeeper = useCallback(async (id: string) => {
    setError(null);

    const verifiedAt = new Date().toISOString();

    setBeekeepers((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'VERIFIED',
              verifiedAt,
              verifiedBy: 'FPO Officer — Karnataka',
            }
          : b
      )
    );
  }, []);

  /*
   * FPO rejection
   */
  const rejectBeekeeper = useCallback(async (id: string) => {
    setError(null);

    setBeekeepers((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'REJECTED',
            }
          : b
      )
    );
  }, []);

  /*
   * Register a hive locally.
   *
   * The previous implementation attempted to insert into Supabase.
   * This prototype now stores it in localStorage.
   */
  const addHive = useCallback(
    async (
      hive: Omit<Hive, 'registeredAt' | 'beekeeperId'> & {
        beekeeperId?: string;
      }
    ) => {
      setError(null);

      const beekeeperId = hive.beekeeperId || 'BK-001';

      const newHive: Hive = {
        ...hive,
        beekeeperId,
        registeredAt: new Date().toISOString().slice(0, 10),
      };

      setHives((prev) => {
        const exists = prev.some((h) => h.id === newHive.id);

        if (exists) {
          setError(`Hive ${newHive.id} already exists.`);
          return prev;
        }

        return [...prev, newHive];
      });
    },
    []
  );

  /*
   * Add a harvest locally.
   */
  const addHarvest = useCallback(async (h: Harvest) => {
    setError(null);

    setHarvests((prev) => {
      const exists = prev.some((item) => item.id === h.id);

      if (exists) {
        return prev;
      }

      return [h, ...prev];
    });

    /*
     * Create/update a local batch so the dashboard and batch pages
     * have something meaningful to display.
     */
    setBatches((prev) => {
      const existingBatch = prev.find((b) => b.id === h.batchId);

      if (existingBatch) {
        const existingHive = existingBatch.sourceHives.find(
          (source) => source.hiveId === h.hiveId
        );

        const sourceHives = existingHive
          ? existingBatch.sourceHives.map((source) =>
              source.hiveId === h.hiveId
                ? {
                    ...source,
                    quantityKg: source.quantityKg + h.quantityKg,
                  }
                : source
            )
          : [
              ...existingBatch.sourceHives,
              {
                hiveId: h.hiveId,
                quantityKg: h.quantityKg,
              },
            ];

        return prev.map((b) =>
          b.id === h.batchId
            ? {
                ...b,
                sourceHives,
                totalKg: b.totalKg + h.quantityKg,
              }
            : b
        );
      }

      const newBatch: Batch = {
        id: h.batchId,
        origin: 'Karnataka',
        sourceHives: [
          {
            hiveId: h.hiveId,
            quantityKg: h.quantityKg,
          },
        ],
        totalKg: h.quantityKg,
        status: 'VERIFIED',
        events: [
          {
            label: 'HARVESTED',
            date: h.date,
            detail: `${h.quantityKg} kg from Hive ${h.hiveId}`,
            icon: '🍯',
          },
        ],
        blockIds: [],
      };

      return [newBatch, ...prev];
    });
  }, []);

  /*
   * Append a block to the local hash-linked blockchain.
   */
  const appendBlock = useCallback(
    async (event: string, batchId: string, payload: string) => {
      setError(null);

      const lastBlock = blocks[blocks.length - 1];

      const newIndex = (lastBlock?.index || 0) + 1;
      const prevHash = lastBlock?.hash || 'GENESIS';

      const block = await createBlock(
        newIndex,
        prevHash,
        event,
        batchId,
        payload
      );

      setBlocks((prev) => [...prev, block]);

      /*
       * Connect the blockchain block to its batch.
       */
      setBatches((prev) =>
        prev.map((batch) =>
          batch.id === batchId
            ? {
                ...batch,
                blockIds: [...batch.blockIds, block.index],
              }
            : batch
        )
      );
    },
    [blocks]
  );

  /*
   * Re-read locally persisted blockchain data.
   */
  const refreshBlocks = useCallback(async () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) return;

      const parsed = JSON.parse(raw);

      if (parsed.blocks) {
        setBlocks(parsed.blocks);
      }
    } catch (error) {
      console.error('Failed to refresh local blockchain:', error);
    }
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

    const hash = await computeBlockHash(
      blocks[i].index,
      prevHash,
      blocks[i].event,
      blocks[i].batchId,
      blocks[i].timestamp,
      blocks[i].payload
    );

    result.push({
      ...blocks[i],
      prevHash,
      hash,
    });
  }

  return result;
}

export function useStore() {
  const ctx = useContext(StoreContext);

  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return ctx;
}