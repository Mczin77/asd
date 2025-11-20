// /api/validate.js
import kv from "./kv";

export default async function handler(req, res) {
  const key = (req.query.key || "").toString();
  if (!key) return res.status(400).json({ ok: false, error: "missing_key" });

  // detect executor from header or query (the LUA script will send it)
  const executorHeader = req.headers["x-executor"] || req.query.executor || "unknown";

  // best effort at client IP (Vercel: x-forwarded-for)
  const ip = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.socket.remoteAddress || "unknown";

  const data = await kv.hgetall(`key:${key}`);
  if (!data || Object.keys(data).length === 0) {
    return res.status(404).json({ ok: false, error: "invalid_key" });
  }

  // check expiration
  const expiresAt = Number(data.expiresAt || 0);
  if (expiresAt !== 0 && Date.now() > expiresAt) {
    return res.status(403).json({ ok: false, error: "expired" });
  }

  // update usage metadata
  const uses = Number(data.uses || 0) + 1;
  await kv.hset(`key:${key}`, {
    usedByIP: ip,
    executor: executorHeader,
    uses
  });

  // optionally store a log entry
  const log = { key, ip, executor: executorHeader, ts: Date.now(), userAgent: req.headers["user-agent"] || "" };
  await kv.lpush("logs:list", JSON.stringify(log));

  return res.status(200).json({ ok: true, key, executor: executorHeader, ip, uses });
}
