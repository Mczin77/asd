import { redis } from "./redis.js";

export default async function handler(req, res) {
  const { key, executor, ip } = req.query;

  if (!key) return res.status(400).json({ ok: false });

  const data = await redis.get(`key:${key}`);
  if (!data) return res.status(404).json({ ok: false, reason: "invalid" });

  // Expiração
  if (data.expiresAt !== 0 && Date.now() > data.expiresAt) {
    return res.status(410).json({ ok: false, reason: "expired" });
  }

  // Atualiza logs
  data.uses++;
  data.executor = executor || data.executor;
  data.usedByIP = ip || data.usedByIP;

  await redis.set(`key:${key}`, data);

  return res.status(200).json({ ok: true, data });
}
