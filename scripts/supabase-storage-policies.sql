-- Ajustez `public-assets` si vous avez change le nom du bucket.
-- A executer dans la console SQL Supabase (ou via le CLI).

begin;

create policy if not exists "Public read public-assets"
on storage.objects
for select
using (
  bucket_id = 'public-assets'
);

create policy if not exists "Authenticated upload public-assets"
on storage.objects
for insert
with check (
  bucket_id = 'public-assets'
  and auth.role() = 'authenticated'
);

create policy if not exists "Owner update public-assets"
on storage.objects
for update
using (
  bucket_id = 'public-assets'
  and auth.uid() = owner
)
with check (
  bucket_id = 'public-assets'
  and auth.uid() = owner
);

create policy if not exists "Owner delete public-assets"
on storage.objects
for delete
using (
  bucket_id = 'public-assets'
  and auth.uid() = owner
);

commit;
