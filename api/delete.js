// /api/delete.js
import kv from "./kv";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const token = req.headers["x-panel-token"];
  if (!token) return res.status(401).json({ error: "unauth" });

  const { key } = req.body || {};
  if (!key) return res.status(400).json({ error: "missing_key" });

  await kv.del(`key:${key}`);
  await kv.srem("keys:set", key);

  return res.status(200).json({ ok: true });
}
