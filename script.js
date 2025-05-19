const proxyBaseURL = "https://chaintrust-solproxy.onrender.com"; // dein echter Proxy

async function scanToken() {
  const token = document.getElementById("contractInput").value.trim();
  const box = document.getElementById("resultBox");

  box.style.display = "block";

  if (!token) {
    box.textContent = "❗ Please enter a contract address.";
    return;
  }

  box.textContent = "🔄 Scanning...";

  try {
    const res = await fetch(`${proxyBaseURL}/scan/${token}`);
    if (!res.ok) throw new Error("API error " + res.status);
    const data = await res.json();
    box.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    box.textContent = "❌ Error: " + e.message;
  }
}
