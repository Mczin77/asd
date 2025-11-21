import { redis } from "./redis.js";

export default async function handler(req, res) {
  const token = req.headers["x-panel-token"];
  if (!token) return res.status(403).json({ ok: false });

  const keys = await redis.lrange("keys:list", 0, -1);
  const full = [];

  for (const k of keys) {
    const data = await redis.get(`key:${k}`);
    if (data) full.push(data);
  }

  return res.status(200).json({ ok: true, keys: full });
}
