import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export const ErrorBoundaryFallback = ({ error, resetErrorBoundary }: ErrorBoundaryFallbackProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mb-6" />
            <h1 className="text-3xl font-bold tracking-tight mb-2">
                {t("errors.somethingWentWrong", "Oops! Something went wrong.")}
            </h1>
            <p className="text-muted-foreground max-w-[500px] mb-8">
                {error.message || t("errors.unexpected", "An unexpected error occurred.")}
            </p>
            <div className="flex gap-4">
                <Button onClick={resetErrorBoundary} className="gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    {t("errors.tryAgain", "Try Again")}
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                    {t("errors.goHome", "Go Home")}
                </Button>
            </div>
        </div>
    );
};
