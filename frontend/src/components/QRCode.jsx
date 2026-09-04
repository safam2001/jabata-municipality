import React from "react";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import "./QRCode.css";

const QRCodePage = () => {
  const { t } = useTranslation();

  // رابط الموقع الحالي تلقائياً
  const websiteUrl = window.location.origin;

  const downloadQRCode = () => {
    const svg = document.getElementById("website-qr");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();

    const svgBlob = new Blob(
      [svgData],
      { type: "image/svg+xml;charset=utf-8" }
    );

    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 1200;
      canvas.height = 1200;

      // خلفية بيضاء مناسبة للطباعة
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1200, 1200);

      ctx.drawImage(
        img,
        100,
        100,
        1000,
        1000
      );

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");

      downloadLink.href = pngUrl;
      downloadLink.download = "municipality-website-qr.png";

      downloadLink.click();
    };

    img.src = url;
  };

  return (
    <div className="qr-page">

      <div className="qr-card">

        <div className="qr-header">

          <div className="qr-icon">
            QR
          </div>

          <div>
            <h2>{t("qrCode")}</h2>

            <p>
              {t("qrCodeDescription")}
            </p>
          </div>

        </div>

        <div className="qr-container">

          <QRCode
            id="website-qr"
            value={websiteUrl}
            size={320}
            level="H"
          />

        </div>

        <div className="qr-url">

          <span>{t("websiteLink")}</span>

          <strong>
            {websiteUrl}
          </strong>

        </div>

        <button
          className="qr-download-btn"
          onClick={downloadQRCode}
        >
          ↓ {t("downloadQRCode")}
        </button>

      </div>

    </div>
  );
};

export default QRCodePage;