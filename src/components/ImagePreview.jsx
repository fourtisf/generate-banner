import { useEffect, useRef, useState } from "react";

export default function ImagePreview({
  printRef,
  selectedTemplate,
  dateText,
  coinsT1,
  coinsT2,
  coinsT3,
}) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Menentukan rasio berdasarkan template
  const isSquare = selectedTemplate === "/template3.jpg";
  const isStaticBanner =
    selectedTemplate === "/template5.jpg" ||
    selectedTemplate === "/template6.jpg";

  const baseWidth = 1280;
  const baseHeight = isSquare ? 1280 : isStaticBanner ? 426 : 720;
  const aspectStyle = isSquare ? "1/1" : isStaticBanner ? "3/1" : "16/9";

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const width = wrapperRef.current.clientWidth;
        setScale(width / baseWidth);
      }
    };

    const observer = new ResizeObserver(updateScale);
    if (wrapperRef.current) observer.observe(wrapperRef.current);

    updateScale();
    return () => observer.disconnect();
  }, [baseWidth]);

  const dateLength = dateText.length;
  let dateFontSize = isSquare ? "32px" : "18px";
  if (dateLength > 28) dateFontSize = isSquare ? "26px" : "15px";

  const t2Positions = [
    {
      label: "03 (Kiri)",
      logoX: "21.9%",
      logoY: "63%",
      textY: "84.5%",
      logoWidth: "7.7%",
    },
    {
      label: "02 (Tengah)",
      logoX: "50.0%",
      logoY: "59.5%",
      textY: "84.5%",
      logoWidth: "8.6%",
    },
    {
      label: "01 (Kanan)",
      logoX: "78%",
      logoY: "55.5%",
      textY: "84.5%",
      logoWidth: "9.5%",
    },
  ];

  // Koordinat T3 yang sudah kamu kalibrasi dengan presisi
  const t3Positions = [
    {
      label: "TOP 1",
      logoX: "85.2%",
      logoY: "42.4%",
      textY: "50%",
      logoWidth: "10.4%",
    },
    {
      label: "TOP 2",
      logoX: "67.5%",
      logoY: "50.8%",
      textY: "58.5%",
      logoWidth: "10.3%",
    },
    {
      label: "TOP 3",
      logoX: "50%",
      logoY: "59.7%",
      textY: "67.3%",
      logoWidth: "10.4%",
    },
    {
      label: "TOP 4",
      logoX: "32.5%",
      logoY: "67.8%",
      textY: "76%",
      logoWidth: "10.3%",
    },
    {
      label: "TOP 5",
      logoX: "14%",
      logoY: "76.0%",
      textY: "84%",
      logoWidth: "10.4%",
    },
  ];

  // Estimasi Koordinat T4 (Layout Terang Horizontal)
  const t4Positions = [
    {
      label: "TOP 1",
      logoX: "15.9%",
      logoY: "46.2%",
      textY: "81%",
      logoWidth: "8.7%",
    },
    {
      label: "TOP 2",
      logoX: "33%",
      logoY: "46.2%",
      textY: "81%",
      logoWidth: "8.7%",
    },
    {
      label: "TOP 3",
      logoX: "50%",
      logoY: "46.2%",
      textY: "81%",
      logoWidth: "8.7%",
    },
    {
      label: "TOP 4",
      logoX: "67%",
      logoY: "46.2%",
      textY: "81%",
      logoWidth: "8.7%",
    },
    {
      label: "TOP 5",
      logoX: "84.1%",
      logoY: "46.2%",
      textY: "81%",
      logoWidth: "8.7%",
    },
  ];

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        backgroundColor: "#0b1121",
        aspectRatio: aspectStyle,
      }}
    >
      <div
        id="preview-capture"
        ref={printRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          backgroundImage: `url(${selectedTemplate})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!isStaticBanner && (
          <>
            {/* RENDER T1 */}
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

                  let dynamicFontSize = "28px";
                  if (coin.name.length > 10) dynamicFontSize = "16px";
                  else if (coin.name.length > 7) dynamicFontSize = "20px";
                  else if (coin.name.length > 4) dynamicFontSize = "24px";

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
                            width: "16%",
                            aspectRatio: "1/1",
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

            {/* RENDER T2 */}
            {selectedTemplate === "/template2.jpg" &&
              coinsT2.map((coin, index) => {
                const pos = t2Positions[index];
                let nameSize = "40px";
                if (coin.name.length > 10) nameSize = "22px";
                else if (coin.name.length > 7) nameSize = "28px";
                else if (coin.name.length > 5) nameSize = "34px";

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
                          transform: "translate(-50%, -50%)",
                          width: pos.logoWidth,
                          aspectRatio: "1/1",
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        {coin.name}
                      </span>
                      <span
                        style={{
                          color: "#00ffaa",
                          fontSize: "27px",
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

            {/* RENDER T3 (DARK) */}
            {selectedTemplate === "/template3.jpg" && (
              <>
                <div
                  style={{
                    position: "absolute",
                    top: "27.5%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#ffffff",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "32px",
                    fontWeight: "700",
                    lineHeight: "1",
                    letterSpacing: "2px",
                    textAlign: "center",
                    width: "50%",
                    whiteSpace: "nowrap",
                    textShadow: "0px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {dateText}
                </div>

                {coinsT3.map((coin, index) => {
                  const pos = t3Positions[index];

                  // PERBAIKAN: Skala font bertingkat agar tulisan panjang tidak meluber dari kotak
                  let nameSize = "34px";
                  if (coin.name.length > 11) nameSize = "16px";
                  else if (coin.name.length > 8) nameSize = "20px";
                  else if (coin.name.length > 6) nameSize = "26px";
                  else if (coin.name.length > 4) nameSize = "30px";

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
                            transform: "translate(-50%, -50%)",
                            width: pos.logoWidth,
                            aspectRatio: "1/1",
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
                          width: "12%",
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
                            whiteSpace: "nowrap",
                          }}
                        >
                          {coin.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* RENDER T4 (LIGHT) */}
            {selectedTemplate === "/template4.jpg" && (
              <>
                {coinsT3.map((coin, index) => {
                  const pos = t4Positions[index];

                  // PERBAIKAN: Skala font bertingkat agar tulisan panjang tidak meluber dari kotak hitam
                  let nameSize = "28px";
                  if (coin.name.length > 11) nameSize = "14px";
                  else if (coin.name.length > 8) nameSize = "17px";
                  else if (coin.name.length > 6) nameSize = "21px";
                  else if (coin.name.length > 4) nameSize = "24px";

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
                            transform: "translate(-50%, -50%)",
                            width: pos.logoWidth,
                            aspectRatio: "1/1",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {/* Lebar kotak dibatasi (width: 12%) dan white-space di set nowrap */}
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
                          width: "12%",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#ffffff",
                            fontSize: nameSize,
                            fontWeight: "800",
                            textShadow: "0px 1px 3px rgba(0,0,0,0.8)",
                            lineHeight: "1.2",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {coin.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
