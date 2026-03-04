import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

export const LOCALES = ["en", "ar", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES: Locale[] = ["ar"];

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

// Read the initial locale from the URL before React renders, so we can
// kick off the right locale fetch without waiting for React hydration.
const urlLocale = (() => {
  const seg = typeof window !== "undefined"
    ? window.location.pathname.split("/")[1]
    : "en";
  return isValidLocale(seg) ? seg : "en";
})();

// ar.json (37 KB) and ru.json (47 KB) are intentionally NOT static imports.
// They are only fetched when that locale is actually needed, keeping the
// initial JS bundle ~84 KB lighter.
const localeLoaders: Partial<Record<Locale, () => Promise<{ default: Record<string, unknown> }>>> = {
  ar: () => import("./locales/ar.json"),
  ru: () => import("./locales/ru.json"),
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    // Point i18n at the target locale immediately; fallbackLng keeps UI in
    // English while the locale bundle is in-flight for non-English users.
    lng: urlLocale,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

// Kick off the non-English locale load right away so the flash is minimal
if (urlLocale !== "en" && localeLoaders[urlLocale]) {
  localeLoaders[urlLocale]!().then((m) => {
    i18n.addResourceBundle(urlLocale, "translation", m.default, true, true);
    i18n.changeLanguage(urlLocale);
  });
}

/**
 * Ensures a locale's translation bundle is loaded before switching to it.
 * Call this in the language-switcher before calling i18n.changeLanguage().
 */
export const ensureLocaleLoaded = async (lng: Locale): Promise<void> => {
  if (i18n.hasResourceBundle(lng, "translation")) return;
  const loader = localeLoaders[lng];
  if (loader) {
    const m = await loader();
    i18n.addResourceBundle(lng, "translation", m.default, true, true);
  }
};

export default i18n;
