export default function handler(req, res) {
  const { user, pass } = req.body;

  if (user === process.env.PANEL_USER && pass === process.env.PANEL_PASS) {
    return res.json({ ok: true, secret: process.env.PANEL_SECRET });
  }

  res.json({ ok: false });
}
