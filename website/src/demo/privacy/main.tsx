import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { PrivacyRecords } from "./PrivacyRecords.js";
import { resetExamples } from "./data.js";
import "./privacy.css";
import "./frame.css";

function PrivacyPreview() {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const receiveTheme = (event: MessageEvent) => {
      if (event.source !== window.parent || event.origin !== window.location.origin) return;
      if (event.data?.type === "biny-privacy-theme" && ["light", "dark"].includes(event.data.theme)) document.documentElement.dataset.theme = event.data.theme;
    };
    window.addEventListener("message", receiveTheme);
    return () => window.removeEventListener("message", receiveTheme);
  }, []);
  return <main className="privacy-preview settings-modal">
    <header className="preview-heading"><h1>隐私脱敏</h1><span>示例数据</span><button type="button" className="settings-action settings-text-action" onClick={() => { resetExamples(); setRevision(value => value + 1); }}>重置演示</button></header>
    <div className="preview-scroll privacy-settings" key={revision}>
      <PrivacyRecords projectId={`website-demo-${revision}`} enabled />
    </div>
  </main>;
}
createRoot(document.getElementById("root")!).render(<PrivacyPreview />);
