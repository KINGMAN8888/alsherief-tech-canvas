import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isValidLocale, RTL_LOCALES, type Locale } from "@/i18n";

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

        // Sync i18n language
        if (i18n.language !== validLocale) {
            i18n.changeLanguage(validLocale);
        }

        // Sync HTML dir + lang attributes
        const isRtl = RTL_LOCALES.includes(validLocale);
        document.documentElement.dir = isRtl ? "rtl" : "ltr";
        document.documentElement.lang = validLocale;
    }, [locale, i18n, navigate]);

    return { locale };
};
