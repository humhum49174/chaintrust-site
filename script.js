async function scanToken() {
  const token = document.getElementById("contractInput").value.trim();
  const box = document.getElementById("resultBox");

  box.style.display = "block";
  box.innerHTML = "🔍 Scanning...";

  if (!token) {
    box.innerHTML = "❗ Please enter a contract address.";
    return;
  }

  const url = `https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${token}`; // Ethereum (ChainID: 1)
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API error " + res.status);
    const result = await res.json();
    const data = result.result[token.toLowerCase()];
    
    if (!data) {
      box.innerHTML = "❌ Token not found or invalid.";
      return;
    }

    box.innerHTML = `
      <div><strong>🚫 Honeypot:</strong> ${data.is_honeypot === "1" ? "Yes 🚨" : "No ✅"}</div>
      <div><strong>💥 Slippage Modifiable:</strong> ${data.is_slippage_modifiable === "1" ? "Yes ❗" : "No ✅"}</div>
      <div><strong>🔐 Owner Address:</strong> ${data.owner_address}</div>
      <div><strong>👨‍💻 Creator:</strong> ${data.creator_address}</div>
      <div><strong>💱 Transfer Fee:</strong> ${data.sell_tax}% Sell / ${data.buy_tax}% Buy</div>
      <div><strong>🧊 Can Freeze:</strong> ${data.can_take_back_ownership === "1" ? "Yes 🚫" : "No ✅"}</div>
      <div><strong>🧬 Verified:</strong> ${data.is_open_source === "1" ? "Yes ✅" : "No ❌"}</div>
    `;
  } catch (e) {
    box.innerHTML = `❌ Error: ${e.message}`;
  }
}
