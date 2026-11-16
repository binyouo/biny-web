import { createContext, useContext } from "react";
import { zh, type Copy } from "./zh";

/**
 * 目前只有中文，站点使用无前缀路径。新增语言时需要自己的路由结构，
 * 再把 locale 前缀接回来。
 */
export type Locale = "zh";

export const DEFAULT_LOCALE: Locale = "zh";

export const locales: Record<Locale, Copy> = { zh };

export interface I18nValue {
  locale: Locale;
  t: Copy;
}

export const I18nContext = createContext<I18nValue>({ locale: DEFAULT_LOCALE, t: zh });

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

export type { Copy };
