import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Helmet>
        <title>{t("pages.notFoundTitle")}</title>
        <meta name="description" content={t("pages.notFoundDescription")} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t("pages.notFound404")}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t("pages.notFoundMsg")}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {t("pages.returnHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
