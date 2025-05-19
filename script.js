const proxyBaseURL = "https://chaintrust-solproxy.onrender.com";

async function scanToken() {
  const token = document.getElementById("contractInput").value.trim();
  const box = document.getElementById("resultBox");

  box.style.display = "block";
  box.innerHTML = "🔍 Scanning...";

  if (!token) {
    box.innerHTML = "❗ Please enter a contract address.";
    return;
  }

  try {
    const res = await fetch(`${proxyBaseURL}/scan/${token}`);
    if (!res.ok) throw new Error("API error " + res.status);
    const data = await res.json();

    // Beispiel-Datenstruktur aus rugcheck
    const name = data.name || "Unknown";
    const chain = data.chain || "Auto Detected";
    const honeypot = data.honeypotResult?.isHoneypot ? "Yes 🚫" : "No ✅";
    const rugRisk = data.rugRisk || "Unknown";
    const renounced = data.owner?.isRenounced ? "Yes ✅" : "No ❌";
    const verified = data.verified ? "Yes ✅" : "No ❌";
    const liquidity = data.liquidity?.value || "N/A";

    box.innerHTML = `
      <div><strong>📛 Token Name:</strong> ${name}</div>
      <div><strong>🔗 Chain:</strong> ${chain}</div>
      <div><strong>🚫 Honeypot:</strong> ${honeypot}</div>
      <div><strong>💥 Rug Risk:</strong> ${rugRisk}</div>
      <div><strong>🔐 Owner Renounced:</strong> ${renounced}</div>
      <div><strong>✅ Verified:</strong> ${verified}</div>
      <div><strong>💧 Liquidity:</strong> ${liquidity}</div>
    `;
  } catch (e) {
    box.innerHTML = "❌ Error: " + e.message;
  }
}
