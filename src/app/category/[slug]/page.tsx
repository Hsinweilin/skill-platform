import { getDb, CATEGORIES, Post } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ q?: string }> }) {
  const { slug } = await params;
  const { q } = await searchParams;
  const meta = CATEGORIES[slug as keyof typeof CATEGORIES];
  if (!meta) notFound();

  const db = getDb();
  let posts: Post[];
  if (q) {
    posts = db.prepare("SELECT * FROM posts WHERE category = ? AND (title LIKE ? OR content LIKE ?) ORDER BY created_at DESC").all(slug, `%${q}%`, `%${q}%`) as Post[];
  } else {
    posts = db.prepare("SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC").all(slug) as Post[];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{meta.label}</h1>
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search…" className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm flex-1 focus:outline-none focus:border-gray-500" />
        <button className="bg-gray-800 px-4 py-1.5 rounded text-sm hover:bg-gray-700">Search</button>
      </form>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id}>
              <a href={`/post/${p.id}`} className="block p-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-600 transition">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray-500 mt-1">{p.created_at.slice(0, 10)}</div>
                <div className="text-sm text-gray-400 mt-2 line-clamp-2">{p.content.slice(0, 200)}</div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
