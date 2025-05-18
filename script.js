const proxyBaseURL = "https://chaintrust-solproxy.onrender.com"; // DEINE PROXY URL

async function scanToken() {
  const token = document.getElementById("contractInput").value.trim();
  const box = document.getElementById("resultBox");
  if (!token) {
    box.textContent = "Please enter a contract address.";
    return;
  }
  box.textContent = "Loading…";
  try {
    const res = await fetch(`${proxyBaseURL}/scan/${token}`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    box.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    box.textContent = "Error: " + e.message;
  }
}
