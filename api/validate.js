import fs from "fs";

export default function handler(req, res) {
  const { key } = req.query;

  const db = JSON.parse(fs.readFileSync("db.json", "utf8"));
  const found = db.keys.find(k => k.key === key);

  if (!found) {
    return res.json({ valid: false });
  }

  return res.json({ valid: true });
}
