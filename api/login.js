// /api/login.js
export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const { user, pass } = req.body || {};
  const okUser = process.env.PANEL_USER || "MczinOwner";
  const okPass = process.env.PANEL_PASS || "Mczin121314#";

  if (user === okUser && pass === okPass) {
    // token simples (não sensível) — você pode trocar por JWT mais tarde
    const token = Buffer.from(`${user}:${Date.now()}`).toString("base64");
    return res.status(200).json({ ok: true, token });
  }

  return res.status(401).json({ ok: false });
}
