import { createContext, useContext } from "react";
import { zh, type Copy } from "./zh";

/**
 * 目前只有中文。结构保持可扩展：新增语言时补一份实现 Copy 的 locale 文件，
 * 加进 locales，路由前缀 /<locale>/ 已经就位，页面代码不需要改。
 */
export const SUPPORTED_LOCALES = ["zh"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh";

export const locales: Record<Locale, Copy> = { zh };

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** 给站内路径加上当前语言前缀。 */
export function localePath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export interface I18nValue {
  locale: Locale;
  t: Copy;
}

export const I18nContext = createContext<I18nValue>({ locale: DEFAULT_LOCALE, t: zh });

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

export type { Copy };
