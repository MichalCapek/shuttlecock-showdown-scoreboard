import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminCourt from "@/components/AdminCourt.tsx";
import AdminGlobal from "@/components/AdminGlobal.tsx";
import StreamOverlay from "@/components/StreamOverlay.tsx";
import SingleCourtView from "@/components/SingleCourtView.tsx";

const queryClient = new QueryClient();

const App = () => {
  return (
      <div className="bg-transparent text-foreground min-h-screen">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin/:courtId" element={<AdminCourt />} />
                <Route path="/admin" element={<AdminGlobal />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/stream/:courtId" element={<StreamOverlay />} />
                <Route path="/court/:courtId" element={<SingleCourtView />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </div>
  );
};


export default App;
