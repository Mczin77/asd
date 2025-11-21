import { redis } from "./redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email obrigatório" });

  const code = Math.random().toString(36).substring(2, 10).toUpperCase();

  await redis.hset(`user:${email}`, { email, code });

  return res.json({ success: true, email, code });
}
