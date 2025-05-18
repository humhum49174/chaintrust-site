async function analyze() {
    const address = document.getElementById("contractInput").value.trim();
    const resultBox = document.getElementById("resultBox");

    resultBox.className = "";
    resultBox.style.display = "block";

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        resultBox.classList.add("box-error");
        resultBox.innerHTML = "❌ Invalid contract address.";
        return;
    }

    resultBox.classList.add("box-loading");
    resultBox.innerHTML = "<span class='blinking'>🔍 Scanning real data...</span>";

    try {
        const response = await fetch(`https://api.honeypot.is/v1/scan/${address}`);
        const data = await response.json();
        resultBox.classList.remove("box-loading");

        if (data.error) {
            resultBox.classList.add("box-error");
            resultBox.innerHTML = `❌ Error: ${data.error}`;
            return;
        }

        const isHoneypot = data.honeypotResult?.isHoneypot;
        const buyTax = data.honeypotResult?.buyTax ?? "N/A";
        const sellTax = data.honeypotResult?.sellTax ?? "N/A";
        const isVerified = data.sourceCode ? "Yes" : "No";
        const liquidity = data.honeypotResult?.isLpLocked ? "Yes" : "No";

        if (isHoneypot) {
            resultBox.classList.add("box-danger");
            resultBox.innerHTML = `
                🚨 <strong>Scan Result: HONEYPOT</strong><br/>
                🔐 Honeypot: <b>Yes</b><br/>
                💸 Buy Tax: ${buyTax}%<br/>
                💰 Sell Tax: ${sellTax}%<br/>
                🔒 Liquidity Locked: ${liquidity}<br/>
                🧠 Contract Verified: ${isVerified}<br/>
            `;
        } else {
            resultBox.classList.add("box-safe");
            resultBox.innerHTML = `
                ✅ <strong>Scan Result: SAFE</strong><br/>
                🔐 Honeypot: <b>No</b><br/>
                💸 Buy Tax: ${buyTax}%<br/>
                💰 Sell Tax: ${sellTax}%<br/>
                🔒 Liquidity Locked: ${liquidity}<br/>
                🧠 Contract Verified: ${isVerified}<br/>
            `;
        }
    } catch (error) {
        resultBox.classList.add("box-error");
        resultBox.innerHTML = "❌ Error connecting to API.";
    }
}
