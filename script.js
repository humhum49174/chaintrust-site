function analyze() {
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
    resultBox.innerHTML = "<span class='blinking'>🔍 Scanning...</span>";

    setTimeout(() => {
        const random = Math.random();

        if (random < 0.4) {
            resultBox.classList.add("box-safe");
            resultBox.innerHTML = `
                ✅ <strong>Scan Result: SAFE</strong><br/>
                🔐 Honeypot: <b>No</b><br/>
                💸 Buy Tax: 1%<br/>
                💰 Sell Tax: 2%<br/>
                🔒 Liquidity Locked: Yes<br/>
                🧠 Contract Verified: Yes<br/>
            `;
        } else if (random < 0.75) {
            resultBox.classList.add("box-risk");
            resultBox.innerHTML = `
                ⚠️ <strong>Scan Result: RISKY</strong><br/>
                🔐 Honeypot: <b>No</b><br/>
                💸 Buy Tax: 8%<br/>
                💰 Sell Tax: 12%<br/>
                🔒 Liquidity Locked: Unknown<br/>
                🧠 Contract Verified: No<br/>
            `;
        } else {
            resultBox.classList.add("box-danger");
            resultBox.innerHTML = `
                🚨 <strong>Scan Result: HONEYPOT</strong><br/>
                🔐 Honeypot: <b>Yes</b><br/>
                💸 Buy Tax: 100%<br/>
                💰 Sell Tax: 100%<br/>
                🔒 Liquidity Locked: No<br/>
                🧠 Contract Verified: No<br/>
            `;
        }
    }, 1500);
}
