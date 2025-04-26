
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { startPassiveEarning } from "@/lib/store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ShopPage from "./pages/ShopPage";
import ProfilePage from "./pages/ProfilePage";
import WithdrawPage from "./pages/WithdrawPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Запускаем пассивное получение монет при загрузке приложения
    const earningInterval = startPassiveEarning();
    
    // Очистка при размонтировании
    return () => clearInterval(earningInterval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
