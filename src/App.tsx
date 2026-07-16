import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/LoadingScreen";
import Index from "@/pages/Index";
import DashboardV1 from "@/pages/DashboardV1";
import NotFound from "@/pages/NotFound";

const AdminCourt = lazy(() => import("@/components/AdminCourt"));
const AdminGlobal = lazy(() => import("@/components/AdminGlobal"));
const StreamOverlay = lazy(() => import("@/components/StreamOverlay"));
const SingleCourtView = lazy(() => import("@/components/SingleCourtView"));

const App = () => {
    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-transparent text-foreground">
                <TooltipProvider>
                    <Sonner />
                    <BrowserRouter>
                        <Suspense fallback={<LoadingScreen />}>
                            <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="/dashboard/v1" element={<DashboardV1 />} />
                                <Route path="/admin/:courtId" element={<AdminCourt />} />
                                <Route path="/admin" element={<AdminGlobal />} />
                                <Route path="/stream/:courtId" element={<StreamOverlay />} />
                                <Route path="/court/:courtId" element={<SingleCourtView />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </TooltipProvider>
            </div>
        </ErrorBoundary>
    );
};

export default App;
