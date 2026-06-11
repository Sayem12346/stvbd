import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Tv, FolderTree, Image as ImageIcon, Eye } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboard() {
  const [channelsRes, categoriesRes, bannersRes, viewsRes] = await Promise.all([
    supabase.from('channels').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('banners').select('id', { count: 'exact', head: true }),
    supabase.from('channels').select('view_count'),
  ]);

  const totalViews =
    viewsRes.data?.reduce((sum, c) => sum + (c.view_count || 0), 0) || 0;

  return (
    <div>
      <h2 className="font-heading font-extrabold text-2xl mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Tv size={24} />}
          label="Channels"
          value={channelsRes.count || 0}
          color="bg-primary"
        />
        <StatCard
          icon={<FolderTree size={24} />}
          label="Categories"
          value={categoriesRes.count || 0}
          color="bg-accent text-black"
        />
        <StatCard
          icon={<ImageIcon size={24} />}
          label="Banners"
          value={bannersRes.count || 0}
          color="bg-highlight text-black"
        />
        <StatCard
          icon={<Eye size={24} />}
          label="Total Views"
          value={totalViews}
          color="bg-[#15151f]"
        />
      </div>

      <div className="card-brut bg-[#15151f] p-4">
        <h3 className="font-heading font-bold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/import" className="btn-brut bg-primary px-4 py-2 rounded-brut font-heading font-bold text-sm">
            Import M3U Playlist
          </Link>
          <Link href="/admin/banners" className="btn-brut bg-highlight text-black px-4 py-2 rounded-brut font-heading font-bold text-sm">
            Manage Banners
          </Link>
          <Link href="/admin/channels" className="btn-brut bg-accent text-black px-4 py-2 rounded-brut font-heading font-bold text-sm">
            Manage Channels
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`card-brut ${color} p-4`}>
      <div className="mb-2">{icon}</div>
      <p className="font-heading font-extrabold text-2xl">{value}</p>
      <p className="text-sm font-bold opacity-80">{label}</p>
    </div>
  );
}
