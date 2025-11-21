import { redis } from "./redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const token = req.headers["x-panel-token"];
  if (!token) return res.status(403).json({ ok: false });

  const { key } = req.body;

  await redis.del(`key:${key}`);
  await redis.lrem("keys:list", 0, key);

  return res.status(200).json({ ok: true });
}
