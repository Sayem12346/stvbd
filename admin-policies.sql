-- =========================================
-- ADMIN WRITE POLICIES
-- Run this AFTER the first schema.sql
-- =========================================

-- Allow anon role to insert/update/delete (admin auth is handled at app level
-- via password-protected /admin routes using a server-side check).
-- This is simplified for single-admin use. For stronger security later,
-- you can switch to Supabase Auth with proper user roles.

create policy "Admin insert categories" on categories for insert with check (true);
create policy "Admin update categories" on categories for update using (true);
create policy "Admin delete categories" on categories for delete using (true);

create policy "Admin insert channels" on channels for insert with check (true);
create policy "Admin update channels" on channels for update using (true);
create policy "Admin delete channels" on channels for delete using (true);

create policy "Admin insert banners" on banners for insert with check (true);
create policy "Admin update banners" on banners for update using (true);
create policy "Admin delete banners" on banners for delete using (true);

create policy "Admin insert settings" on settings for insert with check (true);
create policy "Admin update settings" on settings for update using (true);

-- =========================================
-- STORAGE BUCKET for banner & logo image uploads
-- =========================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Allow public read of media bucket
create policy "Public read media"
on storage.objects for select
using (bucket_id = 'media');

-- Allow uploads to media bucket (app-level admin check protects this)
create policy "Public upload media"
on storage.objects for insert
with check (bucket_id = 'media');

create policy "Public update media"
on storage.objects for update
using (bucket_id = 'media');

create policy "Public delete media"
on storage.objects for delete
using (bucket_id = 'media');
