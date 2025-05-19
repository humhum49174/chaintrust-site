const chains = [
  { id: 1, name: "Ethereum", icon: "icons/eth.svg" },
  { id: 56, name: "BNB Chain", icon: "icons/bnb.svg" },
  { id: 137, name: "Polygon", icon: "icons/polygon.svg" },
  { id: 42161, name: "Arbitrum", icon: "icons/arbitrum.svg" }
];

function tag(value, successLabel = "Yes", failLabel = "No") {
  if (value === "1" || value === true) return `<span class="tag warning">${successLabel}</span>`;
  if (value === "0" || value === false) return `<span class="tag success">${failLabel}</span>`;
  return `<span class="tag na">N/A</span>`;
}

async function scanToken() {
  const token = document.getElementById("contractInput").value.trim();
  const box = document.getElementById("resultBox");

  box.style.display = "block";
  box.innerHTML = "🔄 Scanning...";

  if (!token) {
    box.innerHTML = "❗ Please enter a contract address.";
    return;
  }

  const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(token);

  if (isSolana) {
    try {
      const res = await fetch(`https://api.rugcheck.xyz/v1/tokens/${token}/report`);
      if (!res.ok) throw new Error("Token not found on Solana");
      const data = await res.json();

      const honeypot = tag(data.honeypotResult?.isHoneypot === false, "No", "Yes");
      const rugscore = data.rugScore ?? "N/A";
      const renounced = tag(data.owner?.isRenounced);
      const liquidity = data.liquidity?.sol ?? "N/A";

      box.innerHTML = `
        <div class="result-card solana">
          <div class="result-header">
            <img src="icons/solana.svg" class="chain-icon" />
            <h3>Solana Token</h3>
          </div>
          <div class="result-body">
            <div class="result-row"><span>RugScore:</span><span>${rugscore} / 100</span></div>
            <div class="result-row"><span>Honeypot:</span>${honeypot}</div>
            <div class="result-row"><span>Renounced:</span>${renounced}</div>
            <div class="result-row"><span>Liquidity:</span><span>${liquidity} SOL</span></div>
          </div>
        </div>
      `;
      return;
    } catch (e) {
      box.innerHTML = `<div class="result-card"><strong>❌ Solana-Scan fehlgeschlagen:</strong> ${e.message}</div>`;
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
        <div class="result-card evm">
          <div class="result-header">
            <img src="${chain.icon}" class="chain-icon" />
            <h3>${chain.name} Token</h3>
          </div>
          <div class="result-body">
            <div class="result-row"><span>Honeypot:</span>${tag(data.is_honeypot === "0", "No", "Yes")}</div>
            <div class="result-row"><span>Buy/Sell Tax:</span><span>${data.buy_tax}% / ${data.sell_tax}%</span></div>
            <div class="result-row"><span>Owner:</span><span>${data.owner_address}</span></div>
            <div class="result-row"><span>Creator:</span><span>${data.creator_address}</span></div>
            <div class="result-row"><span>Can Blacklist:</span>${tag(data.can_blacklist)}</div>
            <div class="result-row"><span>Can Mint:</span>${tag(data.can_mint)}</div>
            <div class="result-row"><span>Open Source:</span>${tag(data.is_open_source)}</div>
          </div>
        </div>
      `;
      break;
    } catch (e) {
      console.warn(`Error on ${chain.name}:`, e);
    }
  }

  if (!found) {
    box.innerHTML = `<div class="result-card"><strong>❌ Token not found on supported EVM chains.</strong></div>`;
  }
}
