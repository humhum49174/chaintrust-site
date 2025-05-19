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
  box.innerHTML = "🔍 Scanning all chains...";

  if (!token) {
    box.innerHTML = "❗ Please enter a contract address.";
    return;
  }

  // Check if it's a Solana address (base58, 32-44 chars)
  const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (solanaRegex.test(token)) {
    try {
      const res = await fetch(`https://api.rugcheck.xyz/v1/tokens/${token}/report`);
      if (!res.ok) throw new Error("Solana token not found");
      const data = await res.json();

      const honeypot = data.honeypotResult?.isHoneypot ? "Yes 🚨" : "No ✅";
      const rugscore = data.rugScore ?? "N/A";
      const renounced = data.owner?.isRenounced ? "Yes ✅" : "No ❌";

      box.innerHTML = `
        <div><strong>🌐 Chain:</strong> Solana</div>
        <div><strong>🚫 Honeypot:</strong> ${honeypot}</div>
        <div><strong>📉 RugScore:</strong> ${rugscore} / 100</div>
        <div><strong>🔐 Owner Renounced:</strong> ${renounced}</div>
        <div><strong>🧠 AI Risk:</strong> ${data.riskAssessment ?? "N/A"}</div>
      `;
      return;
    } catch (e) {
      box.innerHTML = `❌ Solana Scan Failed: ${e.message}`;
      return;
    }
  }

  // Other EVM chains via GoPlus
  let found = false;

  for (const chain of chains) {
    try {
      const res = await fetch(`https://api.gopluslabs.io/api/v1/token_security/${chain.id}?contract_addresses=${token}`);
      if (!res.ok) continue;

      const result = await res.json();
      const data = result.result?.[token.toLowerCase()];
      if (!data) continue;

      found = true;

      box.innerHTML = `
        <div><strong>🌐 Chain:</strong> ${chain.name}</div>
        <div><strong>🚫 Honeypot:</strong> ${data.is_honeypot === "1" ? "Yes 🚨" : "No ✅"}</div>
        <div><strong>💱 Transfer Fee:</strong> ${data.sell_tax}% Sell / ${data.buy_tax}% Buy</div>
        <div><strong>🎛️ Slippage Modifiable:</strong> ${data.is_slippage_modifiable === "1" ? "Yes ❗" : "No ✅"}</div>
        <div><
