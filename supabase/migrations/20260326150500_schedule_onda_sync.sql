-- Schedule Onda Property Content Sync Cron
-- Runs every day at 2:00 AM UTC

SELECT cron.schedule(
    'sync-onda-properties-daily',
    '0 2 * * *',
    $$
    SELECT
      net.http_post(
        url:='https://bjhokdrgjyqhhccpuoaa.supabase.co/functions/v1/onda-sync',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqaG9rZHJnanlxaGhjY3B1b2FhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg5MDI4OCwiZXhwIjoyMDg0NDY2Mjg4fQ.CNNPLs8GsF1KT-iYRRQ6vGcJuYH70bHAsfrpWaqzA3U"}'::jsonb
      ) as request_id;
    $$
);
