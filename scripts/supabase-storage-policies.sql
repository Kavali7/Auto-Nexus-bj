-- Ajustez `Auto-Nexus-bj` si vous avez change le nom du bucket.
-- A executer dans la console SQL Supabase (ou via le CLI).

begin;

drop policy if exists "Public read Auto-Nexus-bj"
on storage.objects;

create policy "Public read Auto-Nexus-bj"
on storage.objects
for select
using (
  bucket_id = 'Auto-Nexus-bj'
);

drop policy if exists "Authenticated upload Auto-Nexus-bj"
on storage.objects;

create policy "Authenticated upload Auto-Nexus-bj"
on storage.objects
for insert
with check (
  bucket_id = 'Auto-Nexus-bj'
  and auth.role() = 'authenticated'
);

drop policy if exists "Owner update Auto-Nexus-bj"
on storage.objects;

create policy "Owner update Auto-Nexus-bj"
on storage.objects
for update
using (
  bucket_id = 'Auto-Nexus-bj'
  and auth.uid() = owner
)
with check (
  bucket_id = 'Auto-Nexus-bj'
  and auth.uid() = owner
);

drop policy if exists "Owner delete Auto-Nexus-bj"
on storage.objects;

create policy "Owner delete Auto-Nexus-bj"
on storage.objects
for delete
using (
  bucket_id = 'Auto-Nexus-bj'
  and auth.uid() = owner
);

commit;
