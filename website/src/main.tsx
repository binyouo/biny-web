import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
/* 字体随静态产物打包，页面不依赖第三方字体服务。 */
import "@fontsource-variable/inter";
/* 中文标题用 800–900 字重，只有 Noto Sans SC 提供；按 unicode-range 分片按需加载。 */
import "@fontsource-variable/noto-sans-sc";
import "./styles.css";

const container = document.getElementById("root");
if (!container) throw new Error("找不到 #root 容器");

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
