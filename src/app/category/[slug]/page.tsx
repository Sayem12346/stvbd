import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InfiniteChannelGrid from '@/components/InfiniteChannelGrid';

export const revalidate = 0;

async function getCategory(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as Category;
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);
  if (!category) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-4">
        <h1 className="font-heading font-extrabold text-2xl tracking-tight px-4 mb-4">
          {category.name}
        </h1>
        <InfiniteChannelGrid categoryId={category.id} title="" />
      </main>
      <Footer />
    </div>
  );
}
