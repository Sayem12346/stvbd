# Sayem TV

Live TV streaming platform - Next.js + Supabase + Neo-Brutalist Design

---

## ডিপ্লয়মেন্ট গাইড (Bangla)

### ধাপ ১: GitHub এ আপলোড

1. github.com এ যান, login করুন
2. নতুন repository তৈরি করুন (নাম: `sayem-tv`, Public বা Private যেটা চান)
3. "uploading an existing file" link এ ক্লিক করুন
4. এই পুরো ফোল্ডারের সব ফাইল drag & drop বা select করে আপলোড করুন
   - **গুরুত্বপূর্ণ:** `.env.local.example` ফাইলটা আপলোড করবেন কিন্তু আসল `.env.local` ফাইল কখনো GitHub এ দেবেন না
5. "Commit changes" চাপুন

### ধাপ ২: Vercel এ Deploy

1. vercel.com এ যান, GitHub দিয়ে login করুন
2. "Add New Project" চাপুন
3. আপনার `sayem-tv` repository select করুন
4. **Environment Variables** সেকশনে এই তিনটা যোগ করুন:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://cjduwyggtiogvmehqmkt.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (আপনার publishable key)
   - `ADMIN_PASSWORD` = (আপনার নিজের পছন্দমতো একটা শক্তিশালী পাসওয়ার্ড দিন)
5. "Deploy" চাপুন

### ধাপ ৩: Database Setup (যদি না করে থাকেন)

Supabase SQL Editor এ গিয়ে `schema.sql` এবং `admin-policies.sql` - দুইটা ফাইলের content ক্রমান্বয়ে Run করুন।

### ধাপ ৪: Admin Panel ব্যবহার

আপনার deployed website এর URL + `/admin` এ যান (যেমন: `yoursite.vercel.app/admin`)

- Login password: যা `ADMIN_PASSWORD` এ দিয়েছেন
- M3U Import: প্লেলিস্ট paste/upload করলেই সব viewer এর কাছে instant চলে যাবে (database এ save হয়, browser-local না)
- Channels, Categories, Banners সব এখান থেকে manage করুন

---

## Features

- Public site: Home, Live TV, Sports, Trending, Recently Added, Search, Category, Player pages
- YouTube-style infinite scroll channel grid
- Banner carousel with channel promotion (Watch Now button)
- Admin panel at `/admin` with M3U/M3U8 auto-import
- Logo/banner image: URL or device upload (Supabase Storage)
- Mini player on scroll
- Fully responsive: mobile, tablet, desktop, TV
