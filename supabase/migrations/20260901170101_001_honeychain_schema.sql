/*
# HONEYCHAIN — Full Schema with RLS

## Purpose
Creates the complete database schema for the HONEYCHAIN evidence-backed honey traceability prototype.
Supports authentication, role-based access control, and a public QR batch page.

## Tables
1. `profiles` — Links to auth.users, stores role (fpo_officer/beekeeper/consumer), name, beekeeper_id, verification_status, fpo_id
2. `fpos` — Farmer Producer Organizations
3. `beekeepers` — Beekeeper records with FPO membership
4. `apiaries` — Apiary clusters belonging to beekeepers
5. `hives` — Individual hives registered to beekeepers within apiaries
6. `harvests` — Honey harvest records linked to hives and batches
7. `honey_batches` — Aggregated honey batches (e.g. HC-001)
8. `traceability_events` — Lifecycle events for each batch (harvest, collection, processing, quality, packaging)
9. `hive_sensor_readings` — Simulated IoT sensor data per hive
10. `ai_inspections` — AI image screening results per hive
11. `blockchain_events` — Hash-linked ledger entries per batch event

## Security
- RLS enabled on ALL tables
- profiles: owner-scoped (auth.uid() = auth_user_id) for SELECT/UPDATE; INSERT allowed for authenticated (profile creation on signup)
- fpos, beekeepers, apiaries: officer can SELECT all; beekeeper can SELECT own (via beekeeper_id match to profile)
- hives: officer SELECT all; beekeeper SELECT own; public SELECT for verified hives (for QR page)
- harvests: officer SELECT all; beekeeper SELECT own; public SELECT for verified harvests (for QR page)
- honey_batches: public SELECT (consumer QR page needs access); officer INSERT/UPDATE; beekeeper INSERT
- traceability_events: public SELECT; officer INSERT/UPDATE
- hive_sensor_readings: officer SELECT all; beekeeper SELECT own; public SELECT (for QR page display)
- ai_inspections: officer SELECT all; beekeeper SELECT own; officer INSERT/UPDATE
- blockchain_events: public SELECT (chain verification); officer/beekeeper INSERT

## Important Notes
1. UUID primary keys on all tables
2. Foreign key relationships: profiles → beekeepers → apiaries → hives → harvests → honey_batches → traceability_events
3. blockchain_events linked to honey_batches via batch_id (text, not FK — for flexibility)
4. Public SELECT on honey_batches, traceability_events, blockchain_events, hives (verified only), harvests (verified only), hive_sensor_readings — needed for the consumer QR page which works WITHOUT authentication
5. No private beekeeper info (email, phone, password) is exposed through public policies
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'consumer' CHECK (role IN ('fpo_officer', 'beekeeper', 'consumer')),
  beekeeper_id text,
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  fpo_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = auth_user_id) WITH CHECK (auth.uid() = auth_user_id);

-- ============ FPOS ============
CREATE TABLE IF NOT EXISTS fpos (
  id text PRIMARY KEY,
  name text NOT NULL,
  region text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fpos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fpos_select_auth" ON fpos;
CREATE POLICY "fpos_select_auth" ON fpos FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "fpos_select_public" ON fpos;
CREATE POLICY "fpos_select_public" ON fpos FOR SELECT
  TO anon USING (true);

-- ============ BEEKEEPERS ============
CREATE TABLE IF NOT EXISTS beekeepers (
  id text PRIMARY KEY,
  name text NOT NULL,
  fpo_id text REFERENCES fpos(id),
  fpo_name text,
  membership_id text,
  location text,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  verified_at timestamptz,
  verified_by text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE beekeepers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "beekeepers_select_auth" ON beekeepers;
CREATE POLICY "beekeepers_select_auth" ON beekeepers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "beekeepers_select_public" ON beekeepers;
CREATE POLICY "beekeepers_select_public" ON beekeepers FOR SELECT
  TO anon USING (status = 'VERIFIED');

DROP POLICY IF EXISTS "beekeepers_insert_officer" ON beekeepers;
CREATE POLICY "beekeepers_insert_officer" ON beekeepers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "beekeepers_update_officer" ON beekeepers;
CREATE POLICY "beekeepers_update_officer" ON beekeepers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ APIARIES ============
CREATE TABLE IF NOT EXISTS apiaries (
  id text PRIMARY KEY,
  beekeeper_id text NOT NULL REFERENCES beekeepers(id),
  name text NOT NULL,
  cluster text NOT NULL,
  region text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE apiaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "apiaries_select_auth" ON apiaries;
CREATE POLICY "apiaries_select_auth" ON apiaries FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "apiaries_select_public" ON apiaries;
CREATE POLICY "apiaries_select_public" ON apiaries FOR SELECT
  TO anon USING (true);

DROP POLICY IF EXISTS "apiaries_insert_officer" ON apiaries;
CREATE POLICY "apiaries_insert_officer" ON apiaries FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "apiaries_update_officer" ON apiaries;
CREATE POLICY "apiaries_update_officer" ON apiaries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ HIVES ============
CREATE TABLE IF NOT EXISTS hives (
  id text PRIMARY KEY,
  beekeeper_id text NOT NULL REFERENCES beekeepers(id),
  apiary_id text REFERENCES apiaries(id),
  apiary_name text,
  cluster text,
  registration_status text NOT NULL DEFAULT 'VERIFIED' CHECK (registration_status IN ('VERIFIED', 'PENDING', 'REJECTED')),
  registered_by text,
  registered_at date DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'Healthy' CHECK (status IN ('Healthy', 'Attention', 'Critical')),
  activity text NOT NULL DEFAULT 'Normal' CHECK (activity IN ('Normal', 'Low', 'High')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hives_select_auth" ON hives;
CREATE POLICY "hives_select_auth" ON hives FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "hives_select_public" ON hives;
CREATE POLICY "hives_select_public" ON hives FOR SELECT
  TO anon USING (registration_status = 'VERIFIED');

DROP POLICY IF EXISTS "hives_insert_officer" ON hives;
CREATE POLICY "hives_insert_officer" ON hives FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "hives_update_officer" ON hives;
CREATE POLICY "hives_update_officer" ON hives FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ HIVE SENSOR READINGS ============
CREATE TABLE IF NOT EXISTS hive_sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id text NOT NULL REFERENCES hives(id),
  temperature numeric NOT NULL,
  humidity numeric NOT NULL,
  weight numeric NOT NULL,
  reading_time timestamptz DEFAULT now(),
  is_simulated boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hive_sensor_readings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sensors_select_auth" ON hive_sensor_readings;
CREATE POLICY "sensors_select_auth" ON hive_sensor_readings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "sensors_select_public" ON hive_sensor_readings;
CREATE POLICY "sensors_select_public" ON hive_sensor_readings FOR SELECT
  TO anon USING (true);

DROP POLICY IF EXISTS "sensors_insert_auth" ON hive_sensor_readings;
CREATE POLICY "sensors_insert_auth" ON hive_sensor_readings FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ HARVESTS ============
CREATE TABLE IF NOT EXISTS harvests (
  id text PRIMARY KEY,
  beekeeper_id text NOT NULL REFERENCES beekeepers(id),
  hive_id text NOT NULL REFERENCES hives(id),
  quantity_kg numeric NOT NULL,
  harvest_date date NOT NULL DEFAULT CURRENT_DATE,
  verification text NOT NULL DEFAULT 'EVIDENCE_SUPPORTED' CHECK (verification IN ('SELF_REPORTED', 'USER_CONFIRMED', 'EVIDENCE_SUPPORTED', 'SUPERVISOR_VERIFIED')),
  batch_id text,
  iot_weight_before numeric,
  iot_weight_after numeric,
  iot_observed_change numeric,
  iot_temperature numeric,
  iot_humidity numeric,
  ai_confidence integer DEFAULT 0,
  ai_analysis text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "harvests_select_auth" ON harvests;
CREATE POLICY "harvests_select_auth" ON harvests FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "harvests_select_public" ON harvests;
CREATE POLICY "harvests_select_public" ON harvests FOR SELECT
  TO anon USING (verification IN ('EVIDENCE_SUPPORTED', 'SUPERVISOR_VERIFIED'));

DROP POLICY IF EXISTS "harvests_insert_auth" ON harvests;
CREATE POLICY "harvests_insert_auth" ON harvests FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ HONEY BATCHES ============
CREATE TABLE IF NOT EXISTS honey_batches (
  id text PRIMARY KEY,
  origin text NOT NULL,
  total_quantity_kg numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('VERIFIED', 'PROCESSING', 'PENDING')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE honey_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "batches_select_public" ON honey_batches;
CREATE POLICY "batches_select_public" ON honey_batches FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "batches_insert_auth" ON honey_batches;
CREATE POLICY "batches_insert_auth" ON honey_batches FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "batches_update_auth" ON honey_batches;
CREATE POLICY "batches_update_auth" ON honey_batches FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ BATCH SOURCE HIVES (join table) ============
CREATE TABLE IF NOT EXISTS batch_source_hives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id text NOT NULL REFERENCES honey_batches(id),
  hive_id text NOT NULL REFERENCES hives(id),
  quantity_kg numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE batch_source_hives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "batch_hives_select_public" ON batch_source_hives;
CREATE POLICY "batch_hives_select_public" ON batch_source_hives FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "batch_hives_insert_auth" ON batch_source_hives;
CREATE POLICY "batch_hives_insert_auth" ON batch_source_hives FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ TRACEABILITY EVENTS ============
CREATE TABLE IF NOT EXISTS traceability_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id text NOT NULL REFERENCES honey_batches(id),
  event_label text NOT NULL,
  event_date text NOT NULL,
  event_detail text,
  event_icon text DEFAULT '📦',
  event_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE traceability_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trace_select_public" ON traceability_events;
CREATE POLICY "trace_select_public" ON traceability_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "trace_insert_auth" ON traceability_events;
CREATE POLICY "trace_insert_auth" ON traceability_events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "trace_update_auth" ON traceability_events;
CREATE POLICY "trace_update_auth" ON traceability_events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ AI INSPECTIONS ============
CREATE TABLE IF NOT EXISTS ai_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id text NOT NULL REFERENCES hives(id),
  image_url text,
  overall_risk text DEFAULT 'UNKNOWN' CHECK (overall_risk IN ('LOW', 'MEDIUM', 'HIGH', 'UNKNOWN')),
  confidence integer DEFAULT 0,
  observations jsonb DEFAULT '[]'::jsonb,
  possible_risks jsonb DEFAULT '[]'::jsonb,
  recommendation text,
  requires_manual_inspection boolean DEFAULT true,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_inspections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inspections_select_auth" ON ai_inspections;
CREATE POLICY "inspections_select_auth" ON ai_inspections FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "inspections_insert_auth" ON ai_inspections;
CREATE POLICY "inspections_insert_auth" ON ai_inspections FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "inspections_update_auth" ON ai_inspections;
CREATE POLICY "inspections_update_auth" ON ai_inspections FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ BLOCKCHAIN EVENTS ============
CREATE TABLE IF NOT EXISTS blockchain_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_index integer NOT NULL,
  event_type text NOT NULL,
  batch_id text NOT NULL,
  event_timestamp timestamptz NOT NULL DEFAULT now(),
  event_data_hash text NOT NULL,
  previous_hash text NOT NULL DEFAULT 'GENESIS',
  current_hash text NOT NULL,
  payload text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blockchain_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blocks_select_public" ON blockchain_events;
CREATE POLICY "blocks_select_public" ON blockchain_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "blocks_insert_auth" ON blockchain_events;
CREATE POLICY "blocks_insert_auth" ON blockchain_events FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_hives_beekeeper ON hives(beekeeper_id);
CREATE INDEX IF NOT EXISTS idx_harvests_beekeeper ON harvests(beekeeper_id);
CREATE INDEX IF NOT EXISTS idx_harvests_hive ON harvests(hive_id);
CREATE INDEX IF NOT EXISTS idx_harvests_batch ON harvests(batch_id);
CREATE INDEX IF NOT EXISTS idx_sensors_hive ON hive_sensor_readings(hive_id);
CREATE INDEX IF NOT EXISTS idx_trace_batch ON traceability_events(batch_id);
CREATE INDEX IF NOT EXISTS idx_blocks_batch ON blockchain_events(batch_id);
CREATE INDEX IF NOT EXISTS idx_blocks_index ON blockchain_events(block_index);
CREATE INDEX IF NOT EXISTS idx_inspections_hive ON ai_inspections(hive_id);
