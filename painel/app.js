// painel/app.js
let PANEL_TOKEN = null;

async function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
  const r = await fetch("/api/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ user, pass })
  });
  const j = await r.json();
  if (j.ok && j.token) {
    PANEL_TOKEN = j.token;
    document.getElementById("authBox").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    await loadKeys();
  } else {
    alert("Login inválido");
  }
}

async function generateKeyUI() {
  if (!PANEL_TOKEN) return alert("Faça login");
  const type = document.getElementById("type").value;
  const days = Number(document.getElementById("days").value || 0);
  const hours = Number(document.getElementById("hours").value || 0);
  const minutes = Number(document.getElementById("minutes").value || 0);

  const r = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "x-panel-token": PANEL_TOKEN
    },
    body: JSON.stringify({ type, days, hours, minutes })
  });
  const j = await r.json();
  if (j.ok) {
    alert("Key gerada: " + j.data.key);
    await loadKeys();
  } else {
    alert("Erro ao gerar");
  }
}

async function loadKeys() {
  if (!PANEL_TOKEN) return;
  const r = await fetch("/api/list", {
    headers: { "x-panel-token": PANEL_TOKEN }
  });
  const j = await r.json();
  const table = document.getElementById("keysBody");
  table.innerHTML = "";
  if (!j.ok) return;
  j.keys.forEach(k=>{
    const tr = document.createElement("tr");
    const expireStr = k.expiresAt && k.expiresAt != 0 ? new Date(Number(k.expiresAt)).toLocaleString() : "Lifetime";
    tr.innerHTML = `
      <td><b>${k.key}</b><div class="small-muted">${k.type || "normal"}</div></td>
      <td>${expireStr}</td>
      <td>${k.uses || 0}</td>
      <td>${k.executor || "-"}</td>
      <td>${k.usedByIP || "-"}</td>
      <td><button class="btn-primary" onclick="delKey('${k.key}')">Deletar</button></td>
    `;
    table.appendChild(tr);
  });
}

async function delKey(key) {
  if (!confirm("Deletar key? " + key)) return;
  const r = await fetch("/api/delete", {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "x-panel-token": PANEL_TOKEN
    },
    body: JSON.stringify({ key })
  });
  const j = await r.json();
  if (j.ok) {
    alert("Deletada");
    await loadKeys();
  } else alert("Erro");
}
