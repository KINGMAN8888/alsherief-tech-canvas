import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// JWT Auth Context Guard
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const { locale } = useParams<{ locale: string }>();
    const location = useLocation();
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030a16] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to={`/${locale}/admin/login`} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default RequireAuth;
