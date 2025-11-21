import { redis } from "./redis.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const keys = await redis.keys("user:*");
  const users = [];

  for (let key of keys) {
    const data = await redis.hgetall(key);
    users.push(data);
  }

  return res.json({ users });
}
