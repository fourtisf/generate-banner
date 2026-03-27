import { useState } from "react";

export default function CaptionGenerator({
  selectedTemplate,
  coinsT1,
  coinsT2,
  coinsT3,
  raidLink,
}) {
  const [captionTab, setCaptionTab] = useState("X");

  // Jika Banner Statis, Sembunyikan Kotak Caption
  if (
    selectedTemplate === "/template4.jpg" ||
    selectedTemplate === "/template5.jpg"
  ) {
    return null;
  }

  const getUsername = (xLink, xHandle) => {
    if (xLink) {
      const match = xLink.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i);
      if (match && match[1]) return match[1];
      const parts = xLink.split("/");
      const lastPart = parts.pop();
      if (lastPart) return lastPart.split("?")[0];
    }
    if (xHandle) return xHandle.replace("@", "");
    return "username";
  };

  const getActiveCoins = () => {
    if (selectedTemplate === "/template1.jpg") return coinsT1;
    if (selectedTemplate === "/template2.jpg") return coinsT2;
    return coinsT3;
  };

  const getXCaption = () => {
    const activeCoins = getActiveCoins();
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
    let text = `Today The most token #Gainers on fourtis.io\n\n`;

    activeCoins.forEach((coin, index) => {
      if (coin.name) {
        const handle = getUsername(coin.xLink, coin.xHandle);
        text += `${emojis[index]} #${coin.name} | @${handle}\n`;
      }
    });

    text += `\nRaid on x ${raidLink} 🕊\n\n#Trending #Gainers #Memecoin #FourtisNewListing`;
    return text;
  };

  const getTGCaptionHTML = () => {
    const activeCoins = getActiveCoins();
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
    let html = `Today The most token #Gainers on fourtis.io<br><br>`;

    activeCoins.forEach((coin, index) => {
      if (coin.name) {
        const handle = getUsername(coin.xLink, coin.xHandle);
        const coinDisplay = coin.tokenLink
          ? `<a href="${coin.tokenLink}">#${coin.name}</a>`
          : `#${coin.name}`;
        const xDisplay = coin.xLink
          ? `<a href="${coin.xLink}">@${handle}</a>`
          : `@${handle}`;
        html += `${emojis[index]} ${coinDisplay} | ${xDisplay}<br>`;
      }
    });

    const raidDisplay = raidLink
      ? `<a href="${raidLink}">Raid on x</a>`
      : `Raid on x`;
    html += `<br>${raidDisplay} 🕊<br><br>#Trending #Gainers #Memecoin #FourtisNewListing`;
    return html;
  };

  const copyXCaption = () => {
    navigator.clipboard.writeText(getXCaption());
    const btn = document.getElementById("copy-btn-x");
    if (btn) {
      btn.innerText = "Disalin! ✅";
      setTimeout(() => {
        btn.innerText = "Salin Teks untuk X";
      }, 2000);
    }
  };

  const copyTGCaption = async () => {
    const html = getTGCaptionHTML();
    const plainText = getXCaption();

    if (navigator.clipboard && window.ClipboardItem) {
      try {
        const clipboardItem = new ClipboardItem({
          "text/plain": new Blob([plainText], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        });
        await navigator.clipboard.write([clipboardItem]);
        const btn = document.getElementById("copy-btn-tg");
        if (btn) {
          btn.innerText = "Disalin ke TG! ✅";
          setTimeout(() => {
            btn.innerText = "Salin Format Telegram";
          }, 2000);
        }
        return;
      } catch (e) {
        console.warn("Clipboard API gagal, mencoba fallback...");
      }
    }

    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.position = "fixed";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand("copy");
      const btn = document.getElementById("copy-btn-tg");
      if (btn) {
        btn.innerText = "Disalin ke TG! ✅";
        setTimeout(() => {
          btn.innerText = "Salin Format Telegram";
        }, 2000);
      }
    } catch (err) {
      alert("Gagal otomatis menyalin tautan.");
    } finally {
      selection.removeAllRanges();
      document.body.removeChild(container);
    }
  };

  return (
    <div className="caption-box">
      <div className="tabs">
        <button
          className={`tab-btn ${captionTab === "X" ? "active" : ""}`}
          onClick={() => setCaptionTab("X")}
        >
          🐦 Format X (Twitter)
        </button>
        <button
          className={`tab-btn ${captionTab === "TG" ? "active" : ""}`}
          onClick={() => setCaptionTab("TG")}
        >
          ✈️ Format Telegram
        </button>
      </div>

      {captionTab === "X" ? (
        <>
          <textarea
            readOnly
            className="caption-textarea"
            value={getXCaption()}
          />
          <button
            id="copy-btn-x"
            className="btn-secondary"
            onClick={copyXCaption}
          >
            Salin Teks untuk X
          </button>
        </>
      ) : (
        <>
          <div
            className="tg-preview"
            dangerouslySetInnerHTML={{ __html: getTGCaptionHTML() }}
          ></div>
          <button
            id="copy-btn-tg"
            className="btn-secondary"
            onClick={copyTGCaption}
          >
            Salin Format Telegram
          </button>
        </>
      )}
    </div>
  );
}
