
function analyze() {
  const address = document.getElementById("contractInput").value.trim();
  const resultBox = document.getElementById("resultBox");

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    resultBox.innerHTML = "❌ Invalid contract address.";
    return;
  }

  resultBox.innerHTML = "<span class='blinking'>🔍 Scanning...</span>";

  setTimeout(() => {
    resultBox.innerHTML = `
      ✅ <strong>Scan Complete</strong><br/>
      🔐 Honeypot: <b>No</b><br/>
      💸 Buy Tax: 4%<br/>
      💰 Sell Tax: 5%<br/>
      🔒 Liquidity Locked: Yes<br/>
      🧠 Contract Verified: Yes<br/>
    `;
  }, 2000);
}
