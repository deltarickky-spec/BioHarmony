BEGIN;

ALTER TABLE scan_requests
  ADD COLUMN IF NOT EXISTS client_id varchar(32);

UPDATE scan_requests
SET client_id = 'BH-' ||
  upper(substr(md5(random()::text || clock_timestamp()::text || id::text), 1, 4)) || '-' ||
  upper(substr(md5(random()::text || clock_timestamp()::text || id::text), 5, 4)) || '-' ||
  upper(substr(md5(random()::text || clock_timestamp()::text || id::text), 9, 4))
WHERE client_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS scan_requests_client_id_unique
  ON scan_requests (client_id);

ALTER TABLE scan_requests
  ALTER COLUMN client_id SET NOT NULL;

COMMIT;
