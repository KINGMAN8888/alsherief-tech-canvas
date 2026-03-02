import { useEffect, Suspense, lazy } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "@/components/ui/ErrorBoundaryFallback";
import { useLocaleSync } from "@/hooks/useLocaleSync";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/i18n";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminSkills = lazy(() => import("./pages/admin/AdminSkills"));
const AdminCertifications = lazy(() => import("./pages/admin/AdminCertifications"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const AdminAbout = lazy(() => import("./pages/admin/AdminAbout"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminAccount = lazy(() => import("./pages/admin/AdminAccount"));
const RequireAuth = lazy(() => import("./components/admin/RequireAuth"));

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
  useLocaleSync();
  return <>{children}</>;
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <AuthProvider>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
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

                  {/* Admin Routes */}
                  <Route path="/:locale/admin/login" element={<LocaleWrapper><AdminLogin /></LocaleWrapper>} />

                  {/* Protected Admin Routes Wrapper */}
                  <Route path="/:locale/admin" element={<LocaleWrapper><RequireAuth><AdminLayout /></RequireAuth></LocaleWrapper>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="skills" element={<AdminSkills />} />
                    <Route path="certifications" element={<AdminCertifications />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="about" element={<AdminAbout />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="account" element={<AdminAccount />} />

                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/en" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
