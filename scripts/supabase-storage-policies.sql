-- Ajustez `public-assets` si vous avez change le nom du bucket.
-- A executer dans la console SQL Supabase (ou via le CLI).

begin;

drop policy if exists "Public read public-assets"
on storage.objects;

create policy "Public read public-assets"
on storage.objects
for select
using (
  bucket_id = 'public-assets'
);

drop policy if exists "Authenticated upload public-assets"
on storage.objects;

create policy "Authenticated upload public-assets"
on storage.objects
for insert
with check (
  bucket_id = 'public-assets'
  and auth.role() = 'authenticated'
);

drop policy if exists "Owner update public-assets"
on storage.objects;

create policy "Owner update public-assets"
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

drop policy if exists "Owner delete public-assets"
on storage.objects;

create policy "Owner delete public-assets"
on storage.objects
for delete
using (
  bucket_id = 'public-assets'
  and auth.uid() = owner
);

commit;
