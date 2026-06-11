'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 rounded-brut border-2 border-transparent hover:border-black hover:bg-highlight hover:shadow-brut-sm transition-all whitespace-nowrap font-heading font-bold text-sm text-left"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}
