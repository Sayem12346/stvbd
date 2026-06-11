import Link from 'next/link';
import {
  LayoutDashboard,
  Tv,
  FolderTree,
  Image as ImageIcon,
  Upload,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import LogoutButton from './LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bgdark">
      <aside className="md:w-56 border-b-2 md:border-b-0 md:border-r-2 border-black p-4">
        <h1 className="font-heading font-extrabold text-xl mb-6">Sayem TV Admin</h1>
        <nav className="flex md:flex-col gap-2 overflow-x-auto scroll-row">
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={18} />}>
            Dashboard
          </AdminNavLink>
          <AdminNavLink href="/admin/channels" icon={<Tv size={18} />}>
            Channels
          </AdminNavLink>
          <AdminNavLink href="/admin/categories" icon={<FolderTree size={18} />}>
            Categories
          </AdminNavLink>
          <AdminNavLink href="/admin/banners" icon={<ImageIcon size={18} />}>
            Banners
          </AdminNavLink>
          <AdminNavLink href="/admin/import" icon={<Upload size={18} />}>
            M3U Import
          </AdminNavLink>
          <AdminNavLink href="/admin/settings" icon={<SettingsIcon size={18} />}>
            Settings
          </AdminNavLink>
          <LogoutButton />
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
    </div>
  );
}

function AdminNavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-brut border-2 border-transparent hover:border-black hover:bg-primary hover:shadow-brut-sm transition-all whitespace-nowrap font-heading font-bold text-sm"
    >
      {icon}
      {children}
    </Link>
  );
}
