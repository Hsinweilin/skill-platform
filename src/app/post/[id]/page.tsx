import { getDb, CATEGORIES, Post } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(Number(id)) as Post | undefined;
  if (!post) notFound();

  const meta = CATEGORIES[post.category as keyof typeof CATEGORIES];

  return (
    <article className="max-w-3xl space-y-4">
      <a href={`/category/${post.category}`} className="text-sm text-gray-400 hover:text-white">← {meta?.label ?? post.category}</a>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="text-sm text-gray-500">{post.created_at.slice(0, 10)}</div>
      <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300 leading-relaxed">{post.content}</div>
    </article>
  );
}
