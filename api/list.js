import { redis } from "./redis.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Método não permitido" });

  const token = req.headers["x-panel-token"];
  if (!token) return res.status(401).json({ error: "Sem token" });

  const keys = await redis.keys("key:*");
  const out = [];

  for (let k of keys) {
    const data = await redis.hgetall(k);
    out.push(data);
  }

  return res.json({ ok: true, keys: out });
}
