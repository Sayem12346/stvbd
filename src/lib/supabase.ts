import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type Channel = {
  id: string;
  name: string;
  stream_url: string;
  logo_url: string | null;
  category_id: string | null;
  is_live: boolean;
  is_trending: boolean;
  is_recent: boolean;
  view_count: number;
  sort_order: number;
  categories?: Category;
};

export type Banner = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  channel_id: string | null;
  sort_order: number;
  is_active: boolean;
  channels?: Channel;
};
