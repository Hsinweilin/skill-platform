import { getDb, Post } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const db = getDb();
  const category = req.nextUrl.searchParams.get("category");
  let posts: Post[];
  if (category) {
    posts = db.prepare("SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC").all(category) as Post[];
  } else {
    posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all() as Post[];
  }
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, category, date } = body;
  if (!title || !content || !category) {
    return NextResponse.json({ error: "title, content, category required" }, { status: 400 });
  }
  const validCats = ["cloud", "leetcode", "agent-ideas"];
  if (!validCats.includes(category)) {
    return NextResponse.json({ error: `category must be one of: ${validCats.join(", ")}` }, { status: 400 });
  }
  const db = getDb();
  const created_at = date || new Date().toISOString().slice(0, 19).replace("T", " ");
  const result = db.prepare("INSERT INTO posts (title, content, category, created_at) VALUES (?, ?, ?, ?)").run(title, content, category, created_at);
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(result.lastInsertRowid) as Post;
  return NextResponse.json(post, { status: 201 });
}
