import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0b0d10",
          color: "#e6edf3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: "#22c55e" }} />
          <div style={{ fontSize: 64, fontWeight: 700 }}>{siteConfig.name}</div>
        </div>
        <div style={{ marginTop: 32, fontSize: 36, color: "#8b949e", maxWidth: 900, lineHeight: 1.3 }}>
          {siteConfig.shortDescription}
        </div>
      </div>
    ),
    size,
  );
}
