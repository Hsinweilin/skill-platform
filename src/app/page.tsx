import { getDb, CATEGORIES, Post } from "@/lib/db";

export const dynamic = "force-dynamic";

function Badge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    cloud: "bg-sky-900 text-sky-300",
    leetcode: "bg-emerald-900 text-emerald-300",
    "agent-ideas": "bg-violet-900 text-violet-300",
    "app-ideas": "bg-amber-900 text-amber-300",
  };
  const label = CATEGORIES[category as keyof typeof CATEGORIES]?.label ?? category;
  return <span className={`text-xs px-2 py-0.5 rounded-full ${colors[category] ?? "bg-gray-700"}`}>{label}</span>;
}

export default function Home() {
  const db = getDb();
  const sections = Object.entries(CATEGORIES).map(([key, meta]) => {
    const posts = db.prepare("SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC LIMIT 5").all(key) as Post[];
    return { key, meta, posts };
  });

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {sections.map(({ key, meta, posts }) => (
        <section key={key}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">{meta.label}</h2>
            <a href={`/category/${key}`} className="text-sm text-gray-400 hover:text-white">View all →</a>
          </div>
          {posts.length === 0 ? (
            <p className="text-gray-500 text-sm">No posts yet.</p>
          ) : (
            <ul className="space-y-2">
              {posts.map((p) => (
                <li key={p.id}>
                  <a href={`/post/${p.id}`} className="block p-3 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-600 transition">
                    <div className="flex items-center gap-2">
                      <Badge category={p.category} />
                      <span className="font-medium">{p.title}</span>
                      <span className="ml-auto text-xs text-gray-500">{p.created_at.slice(0, 10)}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
