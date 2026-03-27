import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import "./App.css";
import CaptionGenerator from "./components/CaptionGenerator";
import ImagePreview from "./components/ImagePreview";

function App() {
  const printRef = useRef();

  const [selectedTemplate, setSelectedTemplate] = useState("/template1.jpg");
  const [dateText, setDateText] = useState("Monday | March.25 2026");
  const [raidLink, setRaidLink] = useState("");

  const [coinsT1, setCoinsT1] = useState(
    Array(8).fill({
      logo: null,
      name: "",
      tokenLink: "",
      xHandle: "",
      xLink: "",
    }),
  );
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
  const [coinsT3, setCoinsT3] = useState(
    Array(5).fill({
      logo: null,
      name: "",
      tokenLink: "",
      xHandle: "",
      xLink: "",
    }),
  );

  const handleCoinChange = (setCoins, coinsState, index, field, value) => {
    const newCoins = [...coinsState];
    newCoins[index] = { ...newCoins[index], [field]: value };
    setCoins(newCoins);
  };

  const handleLogoUpload = (setCoins, coinsState, index, e) => {
    const file = e.target.files[0];
    if (file)
      handleCoinChange(
        setCoins,
        coinsState,
        index,
        "logo",
        URL.createObjectURL(file),
      );
  };

  const handleRemoveLogo = (setCoins, coinsState, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newCoins = [...coinsState];
    newCoins[index] = { ...newCoins[index], logo: null };
    setCoins(newCoins);

    const inputElement =
      e.target.parentElement.querySelector('input[type="file"]');
    if (inputElement) inputElement.value = "";
  };

  const handleDownload = async () => {
    const btn = document.getElementById("download-btn");
    const originalText = btn.innerText;

    // LOGIKA BARU: Jika Template 4 atau 5 (Banner Statis), langsung download file aslinya!
    if (
      selectedTemplate === "/template4.jpg" ||
      selectedTemplate === "/template5.jpg"
    ) {
      const link = document.createElement("a");
      link.href = selectedTemplate;
      link.download =
        selectedTemplate === "/template4.jpg"
          ? "Fourtis-Banner-1.jpg"
          : "Fourtis-Banner-2.jpg";
      link.click();
      return;
    }

    if (btn) btn.innerText = "Memproses Gambar HD... ⏳";

    try {
      const isSquare = selectedTemplate === "/template3.jpg";
      const canvas = await html2canvas(printRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById("preview-capture");
          if (el) el.style.transform = "scale(1)";
        },
      });

      const data = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = data;
      const fileName =
        selectedTemplate.replace("/", "").replace(".jpg", "") +
        "-" +
        dateText.split(" ")[0];
      link.download = `Fourtis-${fileName}.png`;
      link.click();
    } catch (error) {
      console.error("Gagal memproses gambar:", error);
      alert("Terjadi kesalahan saat mendownload gambar.");
    } finally {
      if (btn) btn.innerText = originalText;
    }
  };

  const isStaticBanner =
    selectedTemplate === "/template4.jpg" ||
    selectedTemplate === "/template5.jpg";

  return (
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
          <label className="input-label">1. Pilih Template / Banner</label>
          <select
            className="custom-input"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option value="/template1.jpg">Template 1 (Top 8 Gainers)</option>
            <option value="/template2.jpg">Template 2 (Top 3 Gainers)</option>
            <option value="/template3.jpg">Template 3 (Top 5 Gainers)</option>
            <option value="/template4.jpg">
              Banner 1 (Statis - Launch Project)
            </option>
            <option value="/template5.jpg">
              Banner 2 (Statis - Header V2)
            </option>
          </select>
        </div>

        {/* Jika Banner Statis, sembunyikan semua form input */}
        {isStaticBanner ? (
          <div
            style={{
              padding: "20px",
              backgroundColor: "rgba(0, 229, 255, 0.1)",
              borderRadius: "8px",
              border: "1px dashed #00e5ff",
              color: "#00ffaa",
              textAlign: "center",
              marginBottom: "25px",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            ⭐ <b>Mode Banner Statis</b>
            <br />
            Gambar ini tidak memerlukan teks atau input koin tambahan. Silakan
            klik tombol Download di bawah untuk mengunduh gambar aslinya.
          </div>
        ) : (
          <>
            <div className="input-group">
              <label className="input-label">2. Tanggal & Hari</label>
              <input
                type="text"
                className="custom-input"
                placeholder="Ex: Monday | March.25 2026"
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
              />
            </div>

            {/* FORM TEMPLATE 1 */}
            {selectedTemplate === "/template1.jpg" && (
              <>
                <label className="input-label" style={{ marginTop: "30px" }}>
                  3. Data 8 Koin & Caption
                </label>
                <div className="coins-grid">
                  {coinsT1.map((coin, index) => (
                    <div key={index} className="coin-card">
                      <h4 className="card-header">
                        POSISI {index < 4 ? "KIRI" : "KANAN"} - BARIS{" "}
                        {(index % 4) + 1}
                      </h4>
                      <div className="dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          className="dropzone-input"
                          onChange={(e) =>
                            handleLogoUpload(setCoinsT1, coinsT1, index, e)
                          }
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
                                Terisi
                              </span>
                            </>
                          ) : (
                            <>
                              <span style={{ fontSize: "20px" }}>📥</span>
                              <span style={{ fontSize: "12px" }}>
                                Drag Logo
                              </span>
                            </>
                          )}
                        </div>
                        {coin.logo && (
                          <button
                            className="dropzone-delete-btn"
                            onClick={(e) =>
                              handleRemoveLogo(setCoinsT1, coinsT1, index, e)
                            }
                            title="Hapus Gambar"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="Nama Koin (ex: BTC)"
                        value={coin.name}
                        onChange={(e) =>
                          handleCoinChange(
                            setCoinsT1,
                            coinsT1,
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                      />
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="Link Token (fourtis.io/...)"
                        value={coin.tokenLink}
                        onChange={(e) =>
                          handleCoinChange(
                            setCoinsT1,
                            coinsT1,
                            index,
                            "tokenLink",
                            e.target.value,
                          )
                        }
                      />
                      <div className="input-row">
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Link X (x.com/...)"
                          value={coin.xLink}
                          onChange={(e) =>
                            handleCoinChange(
                              setCoinsT1,
                              coinsT1,
                              index,
                              "xLink",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="@x (Manual)"
                          value={coin.xHandle}
                          onChange={(e) =>
                            handleCoinChange(
                              setCoinsT1,
                              coinsT1,
                              index,
                              "xHandle",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* FORM TEMPLATE 2 */}
            {selectedTemplate === "/template2.jpg" && (
              <>
                <label className="input-label" style={{ marginTop: "10px" }}>
                  3. Data 3 Koin & Caption
                </label>
                <div className="coin-card">
                  {coinsT2.map((coin, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: index !== 2 ? "20px" : "0",
                        paddingBottom: index !== 2 ? "20px" : "0",
                        borderBottom:
                          index !== 2 ? "1px solid #1e293b" : "none",
                      }}
                    >
                      <h4 className="card-header">
                        Posisi {index === 0 ? "03" : index === 1 ? "02" : "01"}
                      </h4>
                      <div className="dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          className="dropzone-input"
                          onChange={(e) =>
                            handleLogoUpload(setCoinsT2, coinsT2, index, e)
                          }
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
                                Terisi
                              </span>
                            </>
                          ) : (
                            <>
                              <span style={{ fontSize: "20px" }}>📥</span>
                              <span style={{ fontSize: "12px" }}>
                                Drag Logo
                              </span>
                            </>
                          )}
                        </div>
                        {coin.logo && (
                          <button
                            className="dropzone-delete-btn"
                            onClick={(e) =>
                              handleRemoveLogo(setCoinsT2, coinsT2, index, e)
                            }
                            title="Hapus Gambar"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="input-row">
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Nama Koin"
                          value={coin.name}
                          onChange={(e) =>
                            handleCoinChange(
                              setCoinsT2,
                              coinsT2,
                              index,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Naik (+10%)"
                          value={coin.percent}
                          onChange={(e) =>
                            handleCoinChange(
                              setCoinsT2,
                              coinsT2,
                              index,
                              "percent",
                              e.target.value,
                            )
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
                          handleCoinChange(
                            setCoinsT2,
                            coinsT2,
                            index,
                            "tokenLink",
                            e.target.value,
                          )
                        }
                      />
                      <div className="input-row">
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Link X (x.com/...)"
                          value={coin.xLink}
                          onChange={(e) =>
                            handleCoinChange(
                              setCoinsT2,
                              coinsT2,
                              index,
                              "xLink",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="@x (Manual)"
                          value={coin.xHandle}
                          onChange={(e) =>
                            handleCoinChange(
                              setCoinsT2,
                              coinsT2,
                              index,
                              "xHandle",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* FORM TEMPLATE 3 */}
            {selectedTemplate === "/template3.jpg" && (
              <>
                <label className="input-label" style={{ marginTop: "10px" }}>
                  3. Data 5 Koin & Caption
                </label>
                <div className="coin-card">
                  {coinsT3.map((coin, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: index !== 4 ? "20px" : "0",
                        paddingBottom: index !== 4 ? "20px" : "0",
                        borderBottom:
                          index !== 4 ? "1px solid #1e293b" : "none",
                      }}
                    >
                      <h4 className="card-header">POSISI TOP {index + 1}</h4>
                      <div className="dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          className="dropzone-input"
                          onChange={(e) =>
                            handleLogoUpload(setCoinsT3, coinsT3, index, e)
                          }
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
                                Terisi
                              </span>
                            </>
                          ) : (
                            <>
                              <span style={{ fontSize: "20px" }}>📥</span>
                              <span style={{ fontSize: "12px" }}>
                                Drag Logo
                              </span>
                            </>
                          )}
                        </div>
                        {coin.logo && (
                          <button
                            className="dropzone-delete-btn"
                            onClick={(e) =>
                              handleRemoveLogo(setCoinsT3, coinsT3, index, e)
                            }
                            title="Hapus Gambar"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="Nama Koin"
                        value={coin.name}
                        onChange={(e) =>
                          handleCoinChange(
                            setCoinsT3,
                            coinsT3,
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                      />
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="Link Token (fourtis.io/...)"
                        value={coin.tokenLink}
                        onChange={(e) =>
                          handleCoinChange(
                            setCoinsT3,
                            coinsT3,
                            index,
                            "tokenLink",
                            e.target.value,
                          )
                        }
                      />
                      <div className="input-row">
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="Link X (x.com/...)"
                          value={coin.xLink}
                          onChange={(e) =>
                            handleCoinChange(
                              setCoinsT3,
                              coinsT3,
                              index,
                              "xLink",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          type="text"
                          className="custom-input"
                          placeholder="@x (Manual)"
                          value={coin.xHandle}
                          onChange={(e) =>
                            handleCoinChange(
                              setCoinsT3,
                              coinsT3,
                              index,
                              "xHandle",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
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
          </>
        )}

        <button
          id="download-btn"
          className="btn-primary"
          onClick={handleDownload}
        >
          {isStaticBanner ? "⬇ Download Banner Asli" : "Download HD Image"}
        </button>
      </div>

      <div className="preview-panel">
        <ImagePreview
          printRef={printRef}
          selectedTemplate={selectedTemplate}
          dateText={dateText}
          coinsT1={coinsT1}
          coinsT2={coinsT2}
          coinsT3={coinsT3}
        />
        <CaptionGenerator
          selectedTemplate={selectedTemplate}
          coinsT1={coinsT1}
          coinsT2={coinsT2}
          coinsT3={coinsT3}
          raidLink={raidLink}
        />
      </div>
    </div>
  );
}

export default App;
