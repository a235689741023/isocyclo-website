import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 所思所想 — 近期文章，支援電子報
const thoughts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/thoughts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().default("隨筆"),
    draft: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

// 文字作品 — 曾發表的邀稿，依刊登平台分類
const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    title: z.string(),
    platform: z.string(), // 邀稿媒體／刊登平台
    date: z.coerce.date(),
    url: z.string().url().optional(), // 原文連結
    note: z.string().optional(), // 一句話介紹
  }),
});

// 個人簡介 — 經歷成果頁最上方的照片與自我介紹（單一檔案）
const about = defineCollection({
  loader: glob({ pattern: "profile.md", base: "./src/content/about" }),
  schema: z.object({
    name: z.string(),
    photo: z.string().default("/uploads/profile-placeholder.svg"),
  }),
});

// 經歷成果 — 各領域累積
const experience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
  schema: z.object({
    title: z.string(),
    field: z.string(), // 領域，如「寫作」「策展」
    period: z.string(), // 例如 "2024 – 2026"
    order: z.number().default(0), // 排序，數字小的在前
  }),
});

// 近況狀態 — 酷酷狀態更新
const status = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/status" }),
  schema: z.object({
    kind: z.enum(["READ", "WATCH", "TRY"]), // 在讀／在看／在嘗試
    text: z.string(),
    date: z.coerce.date(),
  }),
});

// 留言板話題 — 站長發起的討論貼文，每篇有自己的留言串
const topics = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/topics" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { thoughts, works, experience, status, about, topics };
