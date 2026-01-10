-- 1. Storage Bucket erstellen (falls noch nicht vorhanden)
-- Dies muss meistens über das Dashboard gemacht werden, aber wir versuchen es per SQL
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', true)
on conflict (id) do nothing;

-- 2. Storage Policies (Sicherheit)
-- Policy: Jeder kann PDFs ansehen (Public Access)
create policy "PDFs are viewable by everyone"
  on storage.objects for select
  using ( bucket_id = 'pdfs' );

-- Policy: Authentifizierte Nutzer können PDFs hochladen
create policy "Authenticated users can upload PDFs"
  on storage.objects for insert
  with check (
    bucket_id = 'pdfs'
    and auth.role() = 'authenticated'
  );

-- Policy: Nutzer können ihre eigenen PDFs löschen (optional, hier darf jeder Authentifizierte löschen der es hochgeladen hat)
create policy "Users can delete their own PDFs"
  on storage.objects for delete
  using (
    bucket_id = 'pdfs'
    and auth.uid() = owner
  );

-- 3. Update module_pdfs Tabelle RLS (falls nötig)
-- Wir stellen sicher, dass jeder PDFs sehen kann (bereits im Schema, aber zur Sicherheit)
-- alter table module_pdfs enable row level security;
-- create policy "PDFs are viewable by everyone." on module_pdfs for select using (true);
