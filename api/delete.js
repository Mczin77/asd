import kv from "./kv";

export default async function handler(req, res) {
    const { key } = req.query;

    if (!key) return res.status(400).json({ error: "Envie a key" });

    await kv.del(`key:${key}`);

    return res.status(200).json({ success: true });
}
