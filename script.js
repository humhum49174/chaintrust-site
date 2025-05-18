
document.querySelector("button").addEventListener("click", async () => {
    const address = document.getElementById("contractInput").value.trim();
    const resultBox = document.getElementById("resultBox");

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        resultBox.innerText = "❌ Please enter a valid contract address.";
        return;
    }

    resultBox.innerText = "🔍 Scanning contract...";

    try {
        const response = await fetch(`https://api.honeypot.is/v1/check/${address}`);
        const data = await response.json();

        if (!data || !data.status) {
            resultBox.innerText = "❗ Unable to retrieve scan result.";
            return;
        }

        const { isHoneypot, buyTax, sellTax, gasEstimate } = data;

        resultBox.innerHTML = `
            <strong>Scan Result:</strong><br>
            🔐 Honeypot: <b>${isHoneypot ? "🚨 YES" : "✅ NO"}</b><br>
            💸 Buy Tax: ${buyTax}%<br>
            💰 Sell Tax: ${sellTax}%<br>
            ⛽ Gas Used: ${gasEstimate} units
        `;
    } catch (err) {
        resultBox.innerText = "⚠️ Error scanning contract. Try again later.";
        console.error(err);
    }
});
