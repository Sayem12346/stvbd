'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bgdark">
      <form
        onSubmit={handleSubmit}
        className="card-brut bg-[#15151f] p-6 w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-primary border-2 border-black rounded-brut p-2">
            <Lock size={20} strokeWidth={2.5} />
          </div>
          <h1 className="font-heading font-extrabold text-xl">Admin Login</h1>
        </div>

        <label className="block text-sm font-heading font-bold mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 mb-4 text-white focus:outline-none focus:shadow-brut-sm"
          required
        />

        {error && <p className="text-highlight text-sm mb-4 font-bold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-brut bg-primary w-full py-2.5 rounded-brut font-heading font-extrabold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
