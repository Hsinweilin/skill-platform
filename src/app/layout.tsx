import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Platform",
  description: "Track your cloud, leetcode, and agent business learning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
            <a href="/" className="text-lg font-bold tracking-tight">🦞 Skill Platform</a>
            <a href="/category/cloud" className="text-sm text-sky-400 hover:underline">Cloud</a>
            <a href="/category/leetcode" className="text-sm text-emerald-400 hover:underline">LeetCode</a>
            <a href="/category/agent-ideas" className="text-sm text-violet-400 hover:underline">Agent Ideas</a>
            <a href="/category/app-ideas" className="text-sm text-amber-400 hover:underline">App Ideas</a>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
