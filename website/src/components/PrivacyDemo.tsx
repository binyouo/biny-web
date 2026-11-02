import { useEffect, useRef } from "react";
import "./privacy-demo.css";

export function PrivacyDemo() {
  const frame = useRef<HTMLIFrameElement>(null);
  const syncTheme = () => frame.current?.contentWindow?.postMessage({
    type: "biny-privacy-theme", theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light"
  }, window.location.origin);
  useEffect(() => {
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return <div className="privacy-demo-frame"><iframe ref={frame} src="/privacy-demo.html" title="Biny 隐私脱敏交互演示（示例数据）" loading="lazy" onLoad={syncTheme} /></div>;
}
