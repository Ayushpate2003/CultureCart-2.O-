import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Explore from "./pages/Explore";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ArtisanDashboard from "./pages/dashboard/ArtisanDashboard";
import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import UploadCraft from "./pages/artisan/UploadCraft";
import MyProducts from "./pages/artisan/MyProducts";
import Orders from "./pages/artisan/Orders";
import ProfileSettings from "./pages/artisan/ProfileSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/artisan"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <ArtisanDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/buyer"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artisan/upload"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <UploadCraft />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artisan/products"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <MyProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artisan/orders"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artisan/settings"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
