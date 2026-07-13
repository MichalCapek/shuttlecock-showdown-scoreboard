import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminCourt from "@/components/AdminCourt";
import AdminGlobal from "@/components/AdminGlobal";
import StreamOverlay from "@/components/StreamOverlay";
import SingleCourtView from "@/components/SingleCourtView";

const App = () => {
    return (
        <ErrorBoundary>
            <div className="bg-transparent text-foreground min-h-screen">
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/admin/:courtId" element={<AdminCourt />} />
                            <Route path="/admin" element={<AdminGlobal />} />
                            <Route path="/stream/:courtId" element={<StreamOverlay />} />
                            <Route path="/court/:courtId" element={<SingleCourtView />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </div>
        </ErrorBoundary>
    );
};

export default App;
