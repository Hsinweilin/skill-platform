import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('cloud','leetcode','agent-ideas','app-ideas','mini-projects')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
  }
  return _db;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export const CATEGORIES = {
  cloud: { label: "Cloud Learning", color: "sky" },
  leetcode: { label: "LeetCode Concepts", color: "emerald" },
  "agent-ideas": { label: "Agent Business Ideas", color: "violet" },
  "app-ideas": { label: "App Ideas", color: "amber" },
  "mini-projects": { label: "Mini Projects", color: "rose" },
} as const;
