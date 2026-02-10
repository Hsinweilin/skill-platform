import Database from "better-sqlite3";
import { join } from "path";

const db = new Database(join(process.cwd(), "data.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('cloud','leetcode','agent-ideas')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const posts = [
  { title: "AWS VPC Deep Dive", content: "VPCs are the foundation of AWS networking. Key concepts:\n\n- Subnets (public vs private)\n- Route tables and internet gateways\n- NAT gateways for outbound from private subnets\n- Security groups (stateful) vs NACLs (stateless)\n- VPC peering and Transit Gateway for multi-VPC architectures\n\nPractice: Set up a 3-tier architecture with public, private app, and private DB subnets.", category: "cloud", date: "2026-02-08 10:00:00" },
  { title: "Terraform State Management", content: "Remote state is critical for team collaboration.\n\n- Use S3 + DynamoDB for state locking\n- Never commit .tfstate to git\n- Use workspaces or separate state files per environment\n- terraform import for bringing existing resources under management\n- State file contains secrets — encrypt at rest!", category: "cloud", date: "2026-02-09 14:00:00" },
  { title: "Kubernetes Pod Scheduling", content: "Understanding how K8s schedules pods:\n\n- Resource requests vs limits\n- Node selectors and affinity/anti-affinity\n- Taints and tolerations\n- Priority classes for critical workloads\n- Pod Disruption Budgets for availability during maintenance\n\nKey insight: requests are used for scheduling decisions, limits for enforcement.", category: "cloud", date: "2026-02-10 09:00:00" },
  { title: "Two Pointers Pattern", content: "Classic pattern for array problems.\n\nUse when:\n- Sorted array + find pair with target sum\n- Remove duplicates in-place\n- Container with most water\n\nTemplate:\n  left = 0, right = len-1\n  while left < right:\n    if condition: left++\n    else: right--\n\nTime: O(n), Space: O(1)\n\nProblems: LC 1, 11, 15, 26, 167", category: "leetcode", date: "2026-02-08 11:00:00" },
  { title: "Sliding Window", content: "For subarray/substring problems with contiguous elements.\n\nFixed window: maintain window of size k, slide right.\nVariable window: expand right, shrink left when constraint violated.\n\nTemplate (variable):\n  left = 0\n  for right in range(n):\n    update window state\n    while window invalid:\n      shrink from left\n    update answer\n\nProblems: LC 3, 76, 209, 239, 424", category: "leetcode", date: "2026-02-09 16:00:00" },
  { title: "AI Code Review Agent", content: "Business idea: An AI agent that integrates with GitHub PRs.\n\n- Auto-reviews code for bugs, security issues, style\n- Suggests improvements with explanations\n- Learns team patterns over time\n- Pricing: per-seat SaaS, $15-30/dev/month\n\nDifferentiator: Focus on teaching, not just flagging. Each review comment includes a learning link.\n\nMarket: Every dev team does code reviews. Most are bottlenecked.", category: "agent-ideas", date: "2026-02-09 20:00:00" },
  { title: "Infrastructure Drift Detector Agent", content: "Agent that continuously monitors cloud infra for drift from IaC.\n\n- Compares actual state vs Terraform/Pulumi state\n- Alerts on manual changes (ClickOps detection)\n- Auto-generates PRs to reconcile drift\n- Weekly drift reports for compliance\n\nTarget: DevOps teams at mid-size companies (50-500 engineers)\nPricing: Based on number of monitored resources", category: "agent-ideas", date: "2026-02-10 08:00:00" },
];

const insert = db.prepare("INSERT INTO posts (title, content, category, created_at) VALUES (?, ?, ?, ?)");
const tx = db.transaction(() => {
  for (const p of posts) insert.run(p.title, p.content, p.category, p.date);
});
tx();
console.log(`Seeded ${posts.length} posts.`);
db.close();
