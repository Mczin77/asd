const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
    const dbPath = path.join(__dirname, "..", "db.json");
    const db = JSON.parse(fs.readFileSync(dbPath));

    const minutes = parseInt(req.query.minutes) || 60;
    const key = Math.random().toString(36).substring(2, 15);
    const expires = Date.now() + minutes * 60 * 1000;

    db.keys.push({
        key,
        expires,
        ip: null,
        executor: null,
        used: false
    });

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json({
        success: true,
        key,
        expires
    });
};
