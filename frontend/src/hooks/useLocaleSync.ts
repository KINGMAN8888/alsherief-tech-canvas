import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isValidLocale, RTL_LOCALES, ensureLocaleLoaded, type Locale } from "@/i18n";

export const useLocaleSync = () => {
    const { locale } = useParams<{ locale: string }>();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    useEffect(() => {
        const defaultLocale = "en";
        const currentParam = locale ?? "";

        if (!isValidLocale(currentParam)) {
            navigate(`/${defaultLocale}`, { replace: true });
            return;
        }

        const validLocale = currentParam as Locale;

        // Sync HTML dir + lang attributes immediately (no async needed)
        const isRtl = RTL_LOCALES.includes(validLocale);
        document.documentElement.dir = isRtl ? "rtl" : "ltr";
        document.documentElement.lang = validLocale;

        // Ensure bundle is loaded before switching language to avoid flash
        if (i18n.language !== validLocale) {
            ensureLocaleLoaded(validLocale).then(() => {
                i18n.changeLanguage(validLocale);
            });
        }
    }, [locale, i18n, navigate]);

    return { locale };
};
