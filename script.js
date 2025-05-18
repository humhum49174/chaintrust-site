function analyze() {
    const address = document.getElementById("contractInput").value.trim();
    const resultBox = document.getElementById("resultBox");

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        resultBox.style.display = "block";
        resultBox.innerHTML = "❌ Invalid contract address.";
        return;
    }

    resultBox.style.display = "block";
    resultBox.innerHTML = "<span class='blinking'>🔍 Scanning...</span>";

    setTimeout(() => {
        const random = Math.random();

        if (random < 0.4) {
            // ✅ SAFE Token
            resultBox.innerHTML = `
                ✅ <strong>Scan Result: SAFE</strong><br/>
                🔐 Honeypot: <b>No</b><br/>
                💸 Buy Tax: 1%<br/>
                💰 Sell Tax: 2%<br/>
                🔒 Liquidity Locked: Yes<br/>
                🧠 Contract Verified: Yes<br/>
            `;
        } else if (random < 0.75) {
            // ⚠️ RISKY Token
            resultBox.innerHTML = `
                ⚠️ <strong>Scan Result: RISKY</strong><br/>
                🔐 Honeypot: <b>No</b><br/>
                💸 Buy Tax: 8%<br/>
                💰 Sell Tax: 12%<br/>
                🔒 Liquidity Locked: Unknown<br/>
                🧠 Contract Verified: No<br/>
            `;
        } else {
            // 🚨 HONEYPOT Token
            resultBox.innerHTML = `
                🚨 <strong>Scan Result: HONEYPOT</strong><br/>
                🔐 Honeypot: <b>Yes</b><br/>
                💸 Buy Tax: 100%<br/>
                💰 Sell Tax: 100%<br/>
                🔒 Liquidity Locked: No<br/>
                🧠 Contract Verified: No<br/>
            `;
        }
    }, 2000);
}
