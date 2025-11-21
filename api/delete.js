import { redis } from "./redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const token = req.headers["x-panel-token"];
  if (!token) return res.status(401).json({ error: "Token ausente" });

  // aqui você pode validar token depois, por enquanto aceitar tudo
  const { key } = req.body;
  if (!key) return res.status(400).json({ error: "Key obrigatória" });

  // keys são salvas como key:ABCD-1234-XYZ
  const redisKey = `key:${key}`;

  const exists = await redis.exists(redisKey);
  if (!exists) {
    return res.json({ ok: false, error: "Key não encontrada" });
  }

  await redis.del(redisKey);

  return res.json({ ok: true });
}
