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

  box.style.display = "block";
  box.textContent = "🔄 Scanning...";

  if (!token) {
    box.textContent = "❗ Please enter a contract address.";
    return;
  }

  const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(token);

  if (isSolana) {
    try {
      const res = await fetch(`https://api.solsniffer.com/v1/token/${token}`, {
        headers: { "x-api-key": SOLSNIFFER_API_KEY }
      });
      if (!res.ok) throw new Error("Token not found on Solana");
      const data = await res.json();

      box.innerHTML = `
        <strong>🌐 Solana Token</strong><br/>
        🧬 Name: ${data.token_name}<br/>
        💧 Liquidity: $${data.liquidity_usd}<br/>
        🧠 Sniff Score: ${data.snifscore}<br/>
        🧍 Top Holder: ${data.top_holder_percent}%<br/>
        🧨 Honeypot: ${data.honeypot ? "Yes 🚨" : "No ✅"}
      `;
      return;
    } catch (e) {
      box.textContent = "❌ Error: " + e.message;
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
        <strong>🌐 ${chain.name} Token</strong><br/>
        🚨 Honeypot: ${data.is_honeypot === "1" ? "Yes 🚨" : "No ✅"}<br/>
        💸 Buy/Sell Tax: ${data.buy_tax}% / ${data.sell_tax}%<br/>
        🔐 Owner: ${data.owner_address}<br/>
        👨‍💻 Creator: ${data.creator_address}<br/>
        🚫 Blacklist: ${data.can_blacklist === "1" ? "Yes ❌" : "No ✅"}<br/>
        🔁 Mintable: ${data.can_mint === "1" ? "Yes ❌" : "No ✅"}<br/>
        🧩 Verified: ${data.is_open_source === "1" ? "Yes ✅" : "No ❌"}
      `;
      break;
    } catch (e) {
      console.warn(`Error on ${chain.name}:`, e);
    }
  }

  if (!found) {
    box.textContent = "❌ Token not found on EVM chains.";
  }
}
