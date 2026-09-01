import type { ExtractedInfo } from './types';

const hivePattern = /hive\s*(\d+)|hive\s*#?\s*(\d+)|(\d+)\s*(?:no\.?\s*hive)/i;
const quantityPattern = /(\d+(?:\.\d+)?)\s*(kg|kilo|kilogram|kgs|g|gram)/i;
const numberWords: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  // Hindi transliterations
  ek: 1,
  do: 2,
  teen: 3,
  char: 4,
  paanch: 5,
  chhe: 6,
  saat: 7,
  aath: 8,
  nau: 9,
  das: 10,
};

function extractQuantityNumber(text: string): number | undefined {
  const m = text.match(quantityPattern);
  if (m) return parseFloat(m[1]);

  // Try Hindi number words
  const lower = text.toLowerCase();
  for (const [word, num] of Object.entries(numberWords)) {
    const re = new RegExp(`\\b${word}\\b`, 'i');
    if (re.test(lower)) return num;
  }

  // Bare number
  const bare = text.match(/\b(\d+(?:\.\d+)?)\b/);
  if (bare) return parseFloat(bare[1]);
  return undefined;
}

function detectLanguage(text: string): string {
  const hasHindi = /\b(kya|kaunsa|kitna|se|nikala|harvest kiya|kilo|shahad)\b/i.test(text);
  const hasEnglish = /\b(harvest|honey|hive|kg|from|today)\b/i.test(text);
  if (hasHindi && hasEnglish) return 'Hindi/English mixed';
  if (hasHindi) return 'Hindi (transliterated)';
  return 'English';
}

function detectEvent(text: string): string | undefined {
  if (/harvest|nikala|shahad|honey/i.test(text)) return 'HARVEST';
  if (/inspect|inspection|check/i.test(text)) return 'INSPECTION';
  if (/issue|problem|sick|dead|swarm/i.test(text)) return 'ISSUE';
  return undefined;
}

export function extractFromMessage(text: string): ExtractedInfo {
  const hiveMatch = text.match(hivePattern);
  const hiveId = hiveMatch ? (hiveMatch[1] || hiveMatch[2] || hiveMatch[3]) : undefined;

  const event = detectEvent(text);
  const quantity = extractQuantityNumber(text);

  const missing: string[] = [];
  if (!hiveId) missing.push('Hive ID');
  if (!event) missing.push('Event');
  if (!quantity) missing.push('Quantity');

  const filled = [hiveId, event, quantity].filter(Boolean).length;
  const confidence = Math.round(60 + (filled / 3) * 35);

  return {
    hiveId,
    event,
    quantity,
    unit: quantity ? 'kg' : undefined,
    date: 'Today',
    language: detectLanguage(text),
    confidence,
    missing,
  };
}
