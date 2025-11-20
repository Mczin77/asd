// /api/list.js
import kv from "./kv";

export default async function handler(req, res) {
  const token = req.headers["x-panel-token"];
  if (!token) return res.status(401).json({ error: "unauth" });

  const keys = await kv.smembers("keys:set");
  const arr = [];
  for (const k of keys) {
    const d = await kv.hgetall(`key:${k}`);
    if (d && Object.keys(d).length) arr.push(d);
  }

  return res.status(200).json({ ok: true, keys: arr });
}
