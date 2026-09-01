/*
# HONEYCHAIN — Seed Demo Data

## Purpose
Populates all tables with the demo data needed for the SIH prototype.
This includes FPOs, beekeepers, apiaries, hives, sensor readings, harvests,
batches, traceability events, and blockchain events.

## Data
- 2 FPOs (Mysuru, Gujarat)
- 3 Beekeepers (BK-001 verified, BK-002 pending, BK-003 verified)
- 1 Apiary (Mysuru Cluster A)
- 3 Hives (12, 15, 20) all registered to BK-001
- 3 Sensor readings (one per hive, simulated)
- 1 Harvest (H001, Hive 12, 3kg, Evidence Supported)
- 1 Batch (HC-001, Karnataka, 10kg total, Verified)
- 3 Batch source hives (12: 3kg, 15: 4kg, 20: 3kg)
- 5 Traceability events (Harvest, Collection, Processing, Quality, Packaging)
- 4 Blockchain events (hash-linked, using SHA-256 computed in application)

## Important
- Uses INSERT ... ON CONFLICT DO NOTHING for idempotency
- Blockchain hashes are computed by the application and inserted here as pre-calculated values
- Sensor readings are marked is_simulated = true
*/

-- FPOs
INSERT INTO fpos (id, name, region) VALUES
  ('FPO-MYS', 'Mysuru Honey Producers FPO', 'Karnataka'),
  ('FPO-GUJ', 'Gujarat Beekeepers FPO', 'Gujarat')
ON CONFLICT (id) DO NOTHING;

-- Beekeepers
INSERT INTO beekeepers (id, name, fpo_id, fpo_name, membership_id, location, status, verified_at, verified_by) VALUES
  ('BK-001', 'Ramesh Kumar', 'FPO-MYS', 'Mysuru Honey Producers FPO', 'FPO-1023', 'Karnataka', 'VERIFIED', '2026-08-15T10:30:00', 'FPO Officer — Karnataka'),
  ('BK-002', 'Lakshmi Devi', 'FPO-MYS', 'Mysuru Honey Producers FPO', 'FPO-1024', 'Karnataka', 'PENDING', NULL, NULL),
  ('BK-003', 'Suresh Patel', 'FPO-GUJ', 'Gujarat Beekeepers FPO', 'FPO-2017', 'Gujarat', 'VERIFIED', '2026-07-22T09:00:00', 'FPO Officer — Gujarat')
ON CONFLICT (id) DO NOTHING;

-- Apiaries
INSERT INTO apiaries (id, beekeeper_id, name, cluster, region) VALUES
  ('AP-MYS-A', 'BK-001', 'Mysuru Cluster A', 'Mysuru', 'Karnataka')
ON CONFLICT (id) DO NOTHING;

-- Hives
INSERT INTO hives (id, beekeeper_id, apiary_id, apiary_name, cluster, registration_status, registered_by, registered_at, status, activity) VALUES
  ('12', 'BK-001', 'AP-MYS-A', 'Mysuru Cluster A', 'Mysuru', 'VERIFIED', 'FPO Officer', '2026-08-15', 'Healthy', 'Normal'),
  ('15', 'BK-001', 'AP-MYS-A', 'Mysuru Cluster A', 'Mysuru', 'VERIFIED', 'FPO Officer', '2026-08-15', 'Attention', 'Low'),
  ('20', 'BK-001', 'AP-MYS-A', 'Mysuru Cluster A', 'Mysuru', 'VERIFIED', 'FPO Officer', '2026-08-15', 'Healthy', 'Normal')
ON CONFLICT (id) DO NOTHING;

-- Sensor readings (simulated)
INSERT INTO hive_sensor_readings (hive_id, temperature, humidity, weight, is_simulated) VALUES
  ('12', 35.8, 72, 42.1, true),
  ('15', 38.2, 81, 39.4, true),
  ('20', 34.9, 68, 51.8, true)
ON CONFLICT DO NOTHING;

-- Honey batch
INSERT INTO honey_batches (id, origin, total_quantity_kg, status) VALUES
  ('HC-001', 'Karnataka', 10, 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- Batch source hives
INSERT INTO batch_source_hives (batch_id, hive_id, quantity_kg) VALUES
  ('HC-001', '12', 3),
  ('HC-001', '15', 4),
  ('HC-001', '20', 3)
ON CONFLICT DO NOTHING;

-- Harvest
INSERT INTO harvests (id, beekeeper_id, hive_id, quantity_kg, harvest_date, verification, batch_id, iot_weight_before, iot_weight_after, iot_observed_change, iot_temperature, iot_humidity, ai_confidence, ai_analysis) VALUES
  ('H001', 'BK-001', '12', 3, '2026-09-01', 'EVIDENCE_SUPPORTED', 'HC-001', 45.2, 42.1, 3.1, 35.8, 72, 94, 'Reported harvest quantity is consistent with simulated hive-weight evidence.')
ON CONFLICT (id) DO NOTHING;

-- Traceability events
INSERT INTO traceability_events (batch_id, event_label, event_date, event_detail, event_icon, event_order) VALUES
  ('HC-001', 'HARVESTED', '01 Sep 2026', '3 kg from Hive 12', '🍯', 1),
  ('HC-001', 'COLLECTION COMPLETED', '02 Sep 2026', 'Mysuru Collection Centre', '📦', 2),
  ('HC-001', 'PROCESSING COMPLETED', '03 Sep 2026', 'Filtered & standardised', '🏭', 3),
  ('HC-001', 'QUALITY VERIFIED', '04 Sep 2026', 'Moisture 18.2% — within standard', '🔬', 4),
  ('HC-001', 'PACKAGE CREATED', '05 Sep 2026', '500 ml jars × 20', '📦', 5)
ON CONFLICT DO NOTHING;

-- Blockchain events (hashes will be recalculated by the app on first load;
-- these are placeholder values that the app will replace with real computed hashes)
INSERT INTO blockchain_events (block_index, event_type, batch_id, event_timestamp, event_data_hash, previous_hash, current_hash, payload) VALUES
  (1, 'HARVEST_CONFIRMED', 'HC-001', '2026-09-01T08:15:00', 'PLACEHOLDER', 'GENESIS', 'PLACEHOLDER', 'hive=12|qty=3kg|beekeeper=BK-001|verification=EVIDENCE_SUPPORTED'),
  (2, 'COLLECTION_COMPLETED', 'HC-001', '2026-09-02T11:00:00', 'PLACEHOLDER', 'PLACEHOLDER', 'PLACEHOLDER', 'centre=Mysuru|batch=HC-001'),
  (3, 'QUALITY_VERIFIED', 'HC-001', '2026-09-04T14:30:00', 'PLACEHOLDER', 'PLACEHOLDER', 'PLACEHOLDER', 'moisture=18.2|grade=A|batch=HC-001'),
  (4, 'PACKAGE_CREATED', 'HC-001', '2026-09-05T16:45:00', 'PLACEHOLDER', 'PLACEHOLDER', 'PLACEHOLDER', 'jars=20|size=500ml|batch=HC-001')
ON CONFLICT DO NOTHING;
