import { redis } from "./redis.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "method" });

  const keys = await redis.keys("*");
  const data = [];

  for (const k of keys) {
    const value = await redis.get(k);
    data.push({ key: k, value });
  }

  return res.status(200).json({ ok: true, data });
}
