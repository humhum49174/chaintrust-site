const chains = [
  { id: 1, name: "Ethereum" },
  { id: 56, name: "BNB Chain" },
  { id: 137, name: "Polygon" },
  { id: 42161, name: "Arbitrum" }
];

async function scanToken() {
  const token = document.getElementById("contractInput").value.trim();
  const box = document.getElementById("resultBox");

  box.style.display = "block";
  box.textContent = "🔄 Scanning...";

  if (!token) {
    box.textContent = "❗ Please enter a contract address.";
    return;
  }

  // Solana detection
  const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(token);

  if (isSolana) {
    try {
      const res = await fetch(`https://api.rugcheck.xyz/v1/tokens/${token}/report`);
      if (!res.ok) throw new Error("Token not found on Solana");
      const data = await res.json();

      const honeypot = data.honeypotResult?.isHoneypot ? "Yes 🚨" : "No ✅";
      const rugscore = data.rugScore ?? "N/A";
      const renounced = data.owner?.isRenounced ? "Yes ✅" : "No ❌";
      const liquidity = data.liquidity?.sol ?? "N/A";

      box.innerHTML = `
        <strong>🌐 Solana Token</strong><br/>
        📉 RugScore: ${rugscore} / 100<br/>
        🧨 Honeypot: ${honeypot}<br/>
        🔐 Renounced: ${renounced}<br/>
        💧 Liquidity: ${liquidity} SOL
      `;
      return;
    } catch (e) {
      box.textContent = "❌ Solana-Scan fehlgeschlagen: " + e.message;
      return;
    }
  }

  // EVM chains via GoPlus
  let found = false;
  for (const chain of chains) {
    try {
      const res = await fetch(`https://api.gopluslabs.io/api/v1/token_security/${chain.id}?contract_addresses=${token}`);
      const result = await res.json();
      const data = result.result[token.toLowerCase()];
      if (!data) continue;

      found = true;
      box.innerHTML = `
        <strong>🌐 ${chain.name} Token</strong><br/>
        🧨 Honeypot: ${data.is_honeypot === "1" ? "Yes 🚨" : "No ✅"}<br/>
        💸 Tax: ${data.buy_tax}% buy / ${data.sell_tax}% sell<br/>
        🔐 Owner: ${data.owner_address}<br/>
        👨‍💻 Creator: ${data.creator_address}<br/>
        ❌ Blacklist: ${data.can_blacklist === "1" ? "Yes" : "No"}<br/>
        🔁 Mintable: ${data.can_mint === "1" ? "Yes" : "No"}<br/>
        ✅ Verified: ${data.is_open_source === "1" ? "Yes" : "No"}
      `;
      break;
    } catch (e) {
      console.warn(`Fehler auf ${chain.name}:`, e);
    }
  }

  if (!found) {
    box.textContent = "❌ Token nicht gefunden auf EVM-Chains.";
  }
}
