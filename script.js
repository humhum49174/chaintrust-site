const chains = [
  { id: 1, name: "Ethereum" },
  { id: 56, name: "BNB Chain" },
  { id: 137, name: "Polygon" },
  { id: 42161, name: "Arbitrum" }
];

const SOLSNIFFER_API_KEY = "ttgqm520se5mmzg2d8e2ydljv2yu3l";

async function scanToken() {
  const token = document.getElementById("contractInput").value.trim();
  const box = document.getElementById("resultBox");
  box.innerHTML = "🔄 Scanning...";
  box.style.display = "block";

  const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(token);

  if (isSolana) {
    try {
      const res = await fetch(`https://api.solsniffer.com/v1/token/${token}`, {
        headers: { "x-api-key": SOLSNIFFER_API_KEY }
      });
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();

      box.innerHTML = `
        <h3>🌐 Solana Token</h3>
        <p><strong>Name:</strong> ${data.token_name}</p>
        <p><strong>Sniff Score:</strong> ${data.snifscore}</p>
        <p><strong>Liquidity:</strong> $${data.liquidity_usd}</p>
        <p><strong>Top Holder %:</strong> ${data.top_holder_percent}%</p>
        <p><strong>Honeypot:</strong> ${data.honeypot ? "Yes 🚨" : "No ✅"}</p>
      `;
      return;
    } catch (err) {
      box.innerHTML = `❌ Solana-Scan fehlgeschlagen: ${err.message}`;
      return;
    }
  }

  let found = false;
  for (const chain of chains) {
    try {
      const res = await fetch(`https://api.gopluslabs.io/api/v1/token_security/${chain.id}?contract_addresses=${token}`);
      const result = await res.json();
      const data = result.result[token.toLowerCase()];
      if (!data) continue;

      found = true;
      box.innerHTML = `
        <h3>🌐 ${chain.name} Token</h3>
        <p><strong>Honeypot:</strong> ${data.is_honeypot === "1" ? "Yes 🚨" : "No ✅"}</p>
        <p><strong>Buy Tax:</strong> ${data.buy_tax}%</p>
        <p><strong>Sell Tax:</strong> ${data.sell_tax}%</p>
        <p><strong>Owner:</strong> ${data.owner_address}</p>
        <p><strong>Creator:</strong> ${data.creator_address}</p>
        <p><strong>Can Blacklist:</strong> ${data.can_blacklist === "1" ? "Yes ❌" : "No ✅"}</p>
        <p><strong>Can Mint:</strong> ${data.can_mint === "1" ? "Yes ❌" : "No ✅"}</p>
        <p><strong>Open Source:</strong> ${data.is_open_source === "1" ? "Yes ✅" : "No ❌"}</p>
      `;
      break;
    } catch (err) {
      console.warn(`Fehler bei ${chain.name}:`, err);
    }
  }

  if (!found) {
    box.innerHTML = "❌ Token auf EVM-Chains nicht gefunden.";
  }
}
