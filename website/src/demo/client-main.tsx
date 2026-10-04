import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DENSITY_TOKENS } from "../../../src/appearance/density";
import { AppearanceContext } from "../../../src/desktop/renderer/src/appearanceContext";
import { I18nContext, locales } from "../i18n";
import { ClientDemoApp } from "./ClientDemoApp";
import "../../../src/desktop/renderer/src/styles/layers.css";
import "../../../src/desktop/renderer/src/styles/crystal.css";
import "./client-adapter.css";

const html = document.documentElement;
html.style.setProperty("--app-font-size", "18");
for (const [key, value] of Object.entries(DENSITY_TOKENS.compact)) html.style.setProperty(key, value);
const root = document.getElementById("root");
if (!root) throw new Error("找不到客户端演示容器");
createRoot(root).render(<StrictMode><AppearanceContext.Provider value={{ mode: "dark", themeId: null, skin: "default", density: "compact", variables: DENSITY_TOKENS.compact, win98Trail: false }}><I18nContext.Provider value={{ locale: "zh", t: locales.zh }}><ClientDemoApp /></I18nContext.Provider></AppearanceContext.Provider></StrictMode>);
