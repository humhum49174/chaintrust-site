const proxyBaseURL = "https://chaintrust-solproxy.onrender.com"; // dein Solana-Proxy

const CHAINS = {
  1: "Ethereum",
  56: "BSC",
  137: "Polygon",
  42161: "Arbitrum",
  8453: "Base"
};

document.getElementById("scanBtn").addEventListener("click", scanToken);

async function scanToken() {
  const address = document.getElementById("contractInput").value.trim();
  const box = document.getElementById("resultBox");
  box.style.display = "block";

  if (!address) {
    box.textContent = "❗ Please enter a contract address.";
    return;
  }

  box.textContent = "🔍 Scanning...";

  // Solana Token Check
  if (!address.startsWith("0x") && address.length >= 32) {
    try {
      const res = await fetch(`${proxyBaseURL}/scan/${address}`);
      const data = await res.json();
      box.textContent = `🌐 Chain: Solana\n\n` + JSON.stringify(data, null, 2);
    } catch (e) {
      box.textContent = "❌ Solana Error: " + e.message;
    }
    return;
  }

  // EVM Token Check via GoPlus
  try {
    for (const chainId of Object.keys(CHAINS)) {
      const url = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${address}`;
      const res = await fetch(url);
      const json = await res.json();
      const result = json.result[address.toLowerCase()];
      if (result) {
        box.textContent = `🌐 Chain: ${CHAINS[chainId]}\n\n` + JSON.stringify(result, null, 2);
        return;
      }
    }
    box.textContent = "❌ Token not found on supported chains.";
  } catch (err) {
    box.textContent = "❌ Error: " + err.message;
  }
}
