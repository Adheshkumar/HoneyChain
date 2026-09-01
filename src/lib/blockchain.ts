import type { Block } from './types';

async function sha256(message: string): Promise<string> {
  const buffer = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function shortHash(full: string): string {
  return full.toUpperCase().slice(0, 12);
}

export async function computeBlockHash(
  index: number,
  prevHash: string,
  event: string,
  batchId: string,
  timestamp: string,
  payload: string,
): Promise<string> {
  const full = await sha256(`${index}|${prevHash}|${event}|${batchId}|${timestamp}|${payload}`);
  return shortHash(full);
}

export async function verifyChain(blocks: Block[]): Promise<boolean[]> {
  const results: boolean[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const expectedPrev = i === 0 ? 'GENESIS' : blocks[i - 1].hash;
    const recomputed = await computeBlockHash(
      block.index,
      block.prevHash,
      block.event,
      block.batchId,
      block.timestamp,
      block.payload,
    );
    const valid = block.prevHash === expectedPrev && block.hash === recomputed;
    results.push(valid);
  }
  return results;
}

export async function createBlock(
  index: number,
  prevHash: string,
  event: string,
  batchId: string,
  payload: string,
): Promise<Block> {
  const timestamp = new Date().toISOString();
  const hash = await computeBlockHash(index, prevHash, event, batchId, timestamp, payload);
  return { index, event, batchId, prevHash, hash, timestamp, payload };
}
