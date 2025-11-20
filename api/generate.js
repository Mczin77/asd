import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { secret } = req.body;

  if (secret !== process.env.PANEL_SECRET) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const key = Math.random().toString(36).substring(2, 10).toUpperCase();

  const db = JSON.parse(fs.readFileSync("db.json", "utf8"));
  db.keys.push({
    key,
    createdAt: Date.now()
  });

  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

  res.status(200).json({ key });
}
