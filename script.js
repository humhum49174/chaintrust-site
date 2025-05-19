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
        <div><strong>🔐 Owner:</strong> ${data.owner_address}</div>
        <div><strong>👨‍💻 Creator:</strong> ${data.creator_address}</div>
        <div><strong>🔓 Ownership Renounced:</strong> ${data.can_take_back_ownership === "1" ? "No ❌" : "Yes ✅"}</div>
        <div><strong>✅ Verified Contract:</strong> ${data.is_open_source === "1" ? "Yes ✅" : "No ❌"}</div>
      `;
      break;
    } catch (e) {
      console.warn(`Error on chain ${chain.name}:`, e);
    }
  }

  if (!found) {
    box.innerHTML = "❌ Token not found on supported chains.";
  }
}
