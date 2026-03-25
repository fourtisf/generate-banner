import html2canvas from "html2canvas";
import { useRef, useState } from "react";

function App() {
  const printRef = useRef();

  // State Template & Global
  const [selectedTemplate, setSelectedTemplate] = useState("/template1.jpg");
  const [dateText, setDateText] = useState("Monday | March.25 2026");
  const [raidLink, setRaidLink] = useState("");

  // State untuk Tab Caption (X atau Telegram)
  const [captionTab, setCaptionTab] = useState("X");

  // State Template 1
  const [coinsT1, setCoinsT1] = useState(
    Array(8).fill({
      logo: null,
      name: "",
      tokenLink: "",
      xHandle: "",
      xLink: "",
    }),
  );

  // State Template 2
  const [coinsT2, setCoinsT2] = useState(
    Array(3).fill({
      logo: null,
      name: "",
      percent: "",
      tokenLink: "",
      xHandle: "",
      xLink: "",
    }),
  );

  const handleCoinChangeT1 = (index, field, value) => {
    const newCoins = [...coinsT1];
    newCoins[index] = { ...newCoins[index], [field]: value };
    setCoinsT1(newCoins);
  };
  const handleLogoUploadT1 = (index, e) => {
    const file = e.target.files[0];
    if (file) handleCoinChangeT1(index, "logo", URL.createObjectURL(file));
  };

  const handleCoinChangeT2 = (index, field, value) => {
    const newCoins = [...coinsT2];
    newCoins[index] = { ...newCoins[index], [field]: value };
    setCoinsT2(newCoins);
  };
  const handleLogoUploadT2 = (index, e) => {
    const file = e.target.files[0];
    if (file) handleCoinChangeT2(index, "logo", URL.createObjectURL(file));
  };

  const handleDownload = async () => {
    const btn = document.getElementById("download-btn");
    const originalText = btn.innerText;
    if (btn) btn.innerText = "Memproses Gambar HD... ⏳";

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById("preview-capture");
          if (el) {
            el.style.width = "1280px";
            el.style.height = "720px";
            el.style.maxWidth = "none";
          }
        },
      });

      const data = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = data;
      const fileName =
        selectedTemplate === "/template1.jpg"
          ? `Top-8-${dateText}`
          : "Top-3-Gainers";
      link.download = `Fourtis-${fileName}.png`;
      link.click();
    } catch (error) {
      console.error("Gagal memproses gambar:", error);
      alert("Terjadi kesalahan saat mendownload gambar.");
    } finally {
      if (btn) btn.innerText = originalText;
    }
  };

  // ==========================================
  // FUNGSI PINTAR EKSTRAK USERNAME X (REGEX)
  // ==========================================
  const getUsername = (xLink, xHandle) => {
    // 1. Jika ada Link X, ambil username dari URL
    if (xLink) {
      // Regex untuk mendeteksi x.com/username atau twitter.com/username
      const match = xLink.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i);
      if (match && match[1]) {
        return match[1]; // Mengembalikan hanya username-nya saja
      }

      // Fallback jika format link berantakan, ambil path terakhir sebelum "?"
      const parts = xLink.split("/");
      const lastPart = parts.pop();
      if (lastPart) {
        return lastPart.split("?")[0];
      }
    }

    // 2. Jika tidak ada link, ambil dari manual Handle
    if (xHandle) {
      return xHandle.replace("@", "");
    }

    // 3. Default jika kosong semua
    return "username";
  };

  // ==========================================
  // GENERATOR CAPTION UNTUK X (TWITTER)
  // ==========================================
  const getXCaption = () => {
    const activeCoins =
      selectedTemplate === "/template1.jpg" ? coinsT1 : coinsT2;
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
    let text = `Today The most token #Gainers on fourtis.io\n\n`;

    activeCoins.forEach((coin, index) => {
      if (coin.name) {
        // Ekstrak username menggunakan fungsi cerdas
        const handle = getUsername(coin.xLink, coin.xHandle);
        text += `${emojis[index]} #${coin.name} | @${handle}\n`;
      }
    });

    text += `\nRaid on x ${raidLink} 🕊\n\n#Trending #Gainers #Memecoin #FourtisNewListing`;
    return text;
  };

  // ==========================================
  // GENERATOR CAPTION UNTUK TELEGRAM (HTML)
  // ==========================================
  const getTGCaptionHTML = () => {
    const activeCoins =
      selectedTemplate === "/template1.jpg" ? coinsT1 : coinsT2;
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
    let html = `Today The most token #Gainers on fourtis.io<br><br>`;

    activeCoins.forEach((coin, index) => {
      if (coin.name) {
        // Ekstrak username menggunakan fungsi cerdas
        const handle = getUsername(coin.xLink, coin.xHandle);

        // Jadikan tautan HTML (Rich Text)
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

  // Fungsi Copy Plain Text (Untuk X)
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

  // ==========================================
  // FUNGSI COPY CLIPBOARD API MODERN (UNTUK TG)
  // Memaksa Sistem Menyalin Format HTML (Rich Text)
  // ==========================================
  const copyTGCaption = async () => {
    const html = getTGCaptionHTML();
    const plainText = getXCaption(); // Teks mentah sebagai cadangan

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
        return; // Sukses, keluar dari fungsi
      } catch (e) {
        console.warn("Clipboard API gagal, mencoba cara lama...", e);
      }
    }

    // FALLBACK: Cara lama untuk browser yang tidak dukung Clipboard API
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
      alert("Gagal otomatis menyalin tautan. Browser tidak mendukung.");
    } finally {
      selection.removeAllRanges();
      document.body.removeChild(container);
    }
  };

  const dateLength = dateText.length;
  let dateFontSize = "1.4cqw";
  if (dateLength > 35) dateFontSize = "0.9cqw";
  else if (dateLength > 28) dateFontSize = "1.0cqw";
  else if (dateLength > 24) dateFontSize = "1.2cqw";
  else if (dateLength > 20) dateFontSize = "1.3cqw";

  const t2Positions = [
    {
      label: "03 (Kiri)",
      logoX: "21.9%",
      logoY: "63%",
      textY: "84.5%",
      logoSize: "7.7cqw",
      transform: "translate(-50%, -50%)",
    },
    {
      label: "02 (Tengah)",
      logoX: "50.0%",
      logoY: "59.5%",
      textY: "84.5%",
      logoSize: "8.6cqw",
      transform: "translate(-50%, -50%)",
    },
    {
      label: "01 (Kanan)",
      logoX: "78%",
      logoY: "55.5%",
      textY: "84.5%",
      logoSize: "9.5cqw",
      transform: "translate(-50%, -50%)",
    },
  ];

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Orbitron:wght@700&display=swap');
          body { margin: 0; background-color: #0b1121; color: #f8fafc; font-family: 'Montserrat', sans-serif; }
          .app-container { display: flex; flex-direction: column; gap: 30px; padding: 20px; min-height: 100vh; }
          @media (min-width: 1024px) { .app-container { flex-direction: row; padding: 40px; } }
          
          .form-panel { flex: 1; background-color: #151e32; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); max-height: 90vh; overflow-y: auto; border: 1px solid #1e293b; }
          .form-panel::-webkit-scrollbar { width: 8px; }
          .form-panel::-webkit-scrollbar-track { background: #0b1121; border-radius: 4px; }
          .form-panel::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
          
          .preview-panel { flex: 1.5; display: flex; flex-direction: column; gap: 20px; }
          
          .preview-box { container-type: inline-size; container-name: previewbox; position: relative; width: 100%; max-width: 1280px; aspect-ratio: 16/9; background-size: cover; background-position: center; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8); border-radius: 12px; border: 1px solid #334155; }
          
          .caption-box { background-color: #151e32; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; display: flex; flex-direction: column; }
          
          /* Style untuk Tab Menu */
          .tabs { display: flex; gap: 10px; margin-bottom: 15px; }
          .tab-btn { flex: 1; padding: 12px; background-color: #1e293b; color: #94a3b8; border: 1px solid #334155; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; font-family: 'Montserrat', sans-serif; }
          .tab-btn.active { background-color: #00e5ff; color: #000; border-color: #00e5ff; }
          
          .caption-textarea { width: 100%; height: 180px; background-color: #0b1121; color: #94a3b8; border: 1px solid #334155; border-radius: 8px; padding: 15px; box-sizing: border-box; font-family: monospace; font-size: 13px; resize: none; margin-bottom: 15px; }
          .caption-textarea:focus { outline: none; border-color: #00e5ff; }
          
          /* Style untuk Preview TG (Mendukung Tautan) */
          .tg-preview { width: 100%; height: 180px; background-color: #0b1121; color: #94a3b8; border: 1px solid #334155; border-radius: 8px; padding: 15px; box-sizing: border-box; font-family: monospace; font-size: 13px; overflow-y: auto; margin-bottom: 15px; line-height: 1.5; }
          .tg-preview a { color: #00e5ff; text-decoration: none; font-weight: 600; }
          .tg-preview a:hover { text-decoration: underline; }
          
          .input-group { margin-bottom: 25px; }
          .input-label { font-size: 14px; color: #94a3b8; font-weight: 600; margin-bottom: 10px; display: block; }
          .custom-input { width: 100%; padding: 12px; border-radius: 8px; background-color: #0b1121; color: #fff; border: 1px solid #334155; box-sizing: border-box; transition: all 0.3s; font-size: 13px; margin-bottom: 10px; }
          .custom-input:focus { outline: none; border-color: #00e5ff; box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.15); }
          .input-row { display: flex; gap: 10px; }
          
          .coins-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
          @media (min-width: 640px) { .coins-grid { grid-template-columns: 1fr 1fr; } }
          .coin-card { background-color: #0b1121; border: 1px solid #334155; padding: 18px; border-radius: 12px; }
          .card-header { margin: 0 0 15px 0; font-size: 13px; color: #00e5ff; font-weight: 700; }
          
          .dropzone { position: relative; border: 2px dashed #334155; border-radius: 8px; padding: 15px; text-align: center; background-color: #0b1121; color: #94a3b8; transition: all 0.3s ease; margin-bottom: 15px; overflow: hidden; cursor: pointer; }
          .dropzone:hover { border-color: #00e5ff; background-color: rgba(0, 229, 255, 0.05); color: #00e5ff; }
          .dropzone-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10; }
          .dropzone-content { display: flex; flex-direction: column; align-items: center; gap: 5px; pointer-events: none; }
          .dropzone-img-preview { width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid #00e5ff; box-shadow: 0 0 10px rgba(0,229,255,0.3); }
          
          .btn-primary { width: 100%; padding: 16px; background: linear-gradient(135deg, #00e5ff 0%, #00ffaa 100%); border: none; border-radius: 10px; font-weight: 800; font-size: 15px; color: #000; cursor: pointer; transition: transform 0.2s; font-family: 'Montserrat', sans-serif; text-transform: uppercase; }
          .btn-secondary { padding: 12px 20px; background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; font-weight: 700; color: #fff; cursor: pointer; transition: 0.2s; width: 100%; font-family: 'Montserrat', sans-serif; text-transform: uppercase; letter-spacing: 1px; }
          .btn-secondary:hover { background-color: #334155; color: #00e5ff; border-color: #00e5ff; }
        `}
      </style>

      <div className="app-container">
        <div className="form-panel">
          <h2
            style={{
              marginTop: 0,
              color: "#fff",
              fontSize: "28px",
              marginBottom: "30px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ color: "#00e5ff" }}>⚡</span> Fourtis Gen.
          </h2>

          <div className="input-group">
            <label className="input-label">1. Pilih Template</label>
            <select
              className="custom-input"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="/template1.jpg">Template 1 (Top 8 Gainers)</option>
              <option value="/template2.jpg">Template 2 (Top 3 Gainers)</option>
            </select>
          </div>

          {selectedTemplate === "/template1.jpg" && (
            <>
              <div className="input-group">
                <label className="input-label">2. Tanggal & Hari</label>
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Ex: Monday | September.25 2026"
                  value={dateText}
                  onChange={(e) => setDateText(e.target.value)}
                />
              </div>
              <label className="input-label" style={{ marginTop: "30px" }}>
                3. Data 8 Koin & Caption
              </label>
              <div className="coins-grid">
                {coinsT1.map((coin, index) => {
                  const side = index < 4 ? "Kiri" : "Kanan";
                  const row = (index % 4) + 1;
                  return (
                    <div key={index} className="coin-card">
                      <h4 className="card-header">
                        POSISI {side.toUpperCase()} - BARIS {row}
                      </h4>
                      <div className="dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          className="dropzone-input"
                          title="Drag & Drop gambar atau klik"
                          onChange={(e) => handleLogoUploadT1(index, e)}
                        />
                        <div className="dropzone-content">
                          {coin.logo ? (
                            <>
                              <img
                                src={coin.logo}
                                alt="preview"
                                className="dropzone-img-preview"
                              />
                              <span
                                style={{ fontSize: "10px", color: "#00ffaa" }}
                              >
                                Gambar terisi
                              </span>
                            </>
                          ) : (
                            <>
                              <span style={{ fontSize: "20px" }}>📥</span>
                              <span
                                style={{ fontSize: "12px", fontWeight: "600" }}
                              >
                                Klik atau Drag Logo
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="Nama Koin (ex: BTC)"
                        value={coin.name}
                        onChange={(e) =>
                          handleCoinChangeT1(index, "name", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="Link Token (fourtis.io/...)"
                        value={coin.tokenLink}
                        onChange={(e) =>
                          handleCoinChangeT1(index, "tokenLink", e.target.value)
                        }
                      />
                      <div className="input-row">
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Link X (x.com/...)"
                          value={coin.xLink}
                          onChange={(e) =>
                            handleCoinChangeT1(index, "xLink", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Username Manual (@x)"
                          value={coin.xHandle}
                          onChange={(e) =>
                            handleCoinChangeT1(index, "xHandle", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {selectedTemplate === "/template2.jpg" && (
            <>
              <label className="input-label" style={{ marginTop: "10px" }}>
                2. Data 3 Koin & Caption
              </label>
              <div className="coin-card">
                {coinsT2.map((coin, index) => {
                  const posLabel =
                    index === 0
                      ? "03 (Kiri)"
                      : index === 1
                        ? "02 (Tengah)"
                        : "01 (Kanan)";
                  return (
                    <div
                      key={index}
                      style={{
                        marginBottom: index !== 2 ? "20px" : "0",
                        paddingBottom: index !== 2 ? "20px" : "0",
                        borderBottom:
                          index !== 2 ? "1px solid #1e293b" : "none",
                      }}
                    >
                      <h4 className="card-header">Posisi {posLabel}</h4>
                      <div className="dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          className="dropzone-input"
                          title="Drag & Drop gambar atau klik"
                          onChange={(e) => handleLogoUploadT2(index, e)}
                        />
                        <div className="dropzone-content">
                          {coin.logo ? (
                            <>
                              <img
                                src={coin.logo}
                                alt="preview"
                                className="dropzone-img-preview"
                              />
                              <span
                                style={{ fontSize: "10px", color: "#00ffaa" }}
                              >
                                Gambar terisi
                              </span>
                            </>
                          ) : (
                            <>
                              <span style={{ fontSize: "20px" }}>📥</span>
                              <span
                                style={{ fontSize: "12px", fontWeight: "600" }}
                              >
                                Klik atau Drag Logo
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="input-row">
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Nama Koin"
                          value={coin.name}
                          onChange={(e) =>
                            handleCoinChangeT2(index, "name", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Naik (+10%)"
                          value={coin.percent}
                          onChange={(e) =>
                            handleCoinChangeT2(index, "percent", e.target.value)
                          }
                          style={{ width: "40%" }}
                        />
                      </div>
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="Link Token (fourtis.io/...)"
                        value={coin.tokenLink}
                        onChange={(e) =>
                          handleCoinChangeT2(index, "tokenLink", e.target.value)
                        }
                      />
                      <div className="input-row">
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Link X (x.com/...)"
                          value={coin.xLink}
                          onChange={(e) =>
                            handleCoinChangeT2(index, "xLink", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Username Manual (@x)"
                          value={coin.xHandle}
                          onChange={(e) =>
                            handleCoinChangeT2(index, "xHandle", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="input-group" style={{ marginTop: "25px" }}>
            <label className="input-label">4. Tautan Raid on X</label>
            <input
              type="text"
              className="custom-input"
              placeholder="https://x.com/fourtisofc/status/..."
              value={raidLink}
              onChange={(e) => setRaidLink(e.target.value)}
            />
          </div>
          <button
            id="download-btn"
            className="btn-primary"
            onClick={handleDownload}
          >
            Download HD Image
          </button>
        </div>

        {/* ===== PANEL KANAN: LIVE PREVIEW & CAPTION ===== */}
        <div className="preview-panel">
          <div
            id="preview-capture"
            ref={printRef}
            className="preview-box"
            style={{ backgroundImage: `url(${selectedTemplate})` }}
          >
            {selectedTemplate === "/template1.jpg" && (
              <>
                <div
                  style={{
                    position: "absolute",
                    top: "28.6%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#ffffff",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: dateFontSize,
                    fontWeight: "700",
                    lineHeight: "1",
                    letterSpacing: "2px",
                    textAlign: "center",
                    width: "40%",
                    whiteSpace: "nowrap",
                    textShadow: "0px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {dateText}
                </div>
                {coinsT1.map((coin, index) => {
                  const isLeft = index < 4;
                  const horizontalPos = isLeft
                    ? { left: "4.8%" }
                    : { right: "2.3%" };
                  const rowNumber = index % 4;
                  const verticalPos = { top: `${36.2 + rowNumber * 14.5}%` };

                  let dynamicFontSize = "2.2cqw";
                  if (coin.name.length > 10) dynamicFontSize = "1.3cqw";
                  else if (coin.name.length > 7) dynamicFontSize = "1.6cqw";
                  else if (coin.name.length > 4) dynamicFontSize = "1.9cqw";

                  return (
                    <div
                      key={index}
                      style={{
                        position: "absolute",
                        ...horizontalPos,
                        ...verticalPos,
                        transform: "translateY(-50%)",
                        width: "23%",
                        display: "flex",
                        alignItems: "center",
                        boxSizing: "border-box",
                      }}
                    >
                      {coin.logo && (
                        <img
                          src={coin.logo}
                          alt="logo"
                          style={{
                            width: "3.7cqw",
                            height: "3.7cqw",
                            borderRadius: "50%",
                            marginRight: "6%",
                            objectFit: "cover",
                            border: "2px solid rgba(255,255,255,0.2)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span
                        style={{
                          color: "white",
                          fontSize: dynamicFontSize,
                          fontWeight: "800",
                          textShadow: "0px 2px 4px rgba(0,0,0,0.8)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {coin.name}
                      </span>
                    </div>
                  );
                })}
              </>
            )}

            {selectedTemplate === "/template2.jpg" &&
              coinsT2.map((coin, index) => {
                const pos = t2Positions[index];
                let nameSize = "3.1cqw";
                if (coin.name.length > 10) nameSize = "2.1cqw";
                else if (coin.name.length > 7) nameSize = "2.6cqw";

                return (
                  <div key={index}>
                    {coin.logo && (
                      <img
                        src={coin.logo}
                        alt="logo"
                        style={{
                          position: "absolute",
                          left: pos.logoX,
                          top: pos.logoY,
                          transform: pos.transform,
                          width: pos.logoSize,
                          height: pos.logoSize,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        left: pos.logoX,
                        top: pos.textY,
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "20%",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: nameSize,
                          fontWeight: "800",
                          textShadow: "0px 2px 6px rgba(0,0,0,0.9)",
                          lineHeight: "1.2",
                        }}
                      >
                        {coin.name}
                      </span>
                      <span
                        style={{
                          color: "#00ffaa",
                          fontSize: "2.1cqw",
                          fontWeight: "700",
                          textShadow: "0px 2px 4px rgba(0,0,0,0.9)",
                          marginTop: "2px",
                        }}
                      >
                        {coin.percent}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* TAB CAPTION GENERATOR */}
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
        </div>
      </div>
    </>
  );
}

export default App;
