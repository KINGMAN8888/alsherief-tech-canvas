import { useEffect, Suspense, lazy } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { isValidLocale, RTL_LOCALES, type Locale } from "@/i18n";

const Index         = lazy(() => import("./pages/Index"));
const NotFound      = lazy(() => import("./pages/NotFound"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const BlogPost      = lazy(() => import("./pages/BlogPost"));

const queryClient = new QueryClient();

/* ── Scroll-to-top on navigation ── */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

import LoadingSpinner from "@/components/LoadingSpinner";
import CustomCursor from "@/components/CustomCursor";

/* ── Locale sync: reads :locale param, updates i18n + html attributes ── */
const LocaleWrapper = ({ children }: { children: React.ReactNode }) => {
  const { locale } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const validLocale: Locale = isValidLocale(locale ?? "") ? (locale as Locale) : "en";

    if (!isValidLocale(locale ?? "")) {
      navigate(`/en`, { replace: true });
      return;
    }

    // Sync i18n language
    if (i18n.language !== validLocale) {
      i18n.changeLanguage(validLocale);
    }

    // Sync HTML dir + lang attributes
    const isRtl = RTL_LOCALES.includes(validLocale);
    document.documentElement.dir  = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = validLocale;
  }, [locale, i18n, navigate]);

  return <>{children}</>;
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CustomCursor />
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Redirect root to /en */}
              <Route path="/" element={<Navigate to="/en" replace />} />

              {/* Locale-prefixed routes */}
              <Route path="/:locale" element={<LocaleWrapper><Index /></LocaleWrapper>} />
              <Route path="/:locale/projects/:slug" element={<LocaleWrapper><ProjectDetail /></LocaleWrapper>} />
              <Route path="/:locale/blog/:slug" element={<LocaleWrapper><BlogPost /></LocaleWrapper>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/en" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
