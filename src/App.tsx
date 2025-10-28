import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ChooseRole from "./pages/auth/ChooseRole";
import BuyerSignup from "./pages/auth/BuyerSignup";
import ArtisanSignup from "./pages/auth/ArtisanSignup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Terms from "./pages/auth/Terms";
import Privacy from "./pages/auth/Privacy";
import SignUpForm from "./components/auth/SignUpForm";
import Explore from "./pages/Explore";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import LocationLanguage from "./pages/onboarding/LocationLanguage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AllUsers from "./pages/admin/AllUsers";
import AllProducts from "./pages/admin/AllProducts";
import AllArtisans from "./pages/admin/AllArtisans";
import AllOrders from "./pages/admin/AllOrders";
import AdminAnalytics from "./pages/admin/Analytics";
import ArtisanDashboard from "./pages/dashboard/ArtisanDashboard";
import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import UploadCraft from "./pages/artisan/UploadCraft";
import MyProducts from "./pages/artisan/MyProducts";
import Orders from "./pages/artisan/Orders";
import ProfileSettings from "./pages/artisan/ProfileSettings";
import Analytics from "./pages/artisan/Analytics";
import Earnings from "./pages/artisan/Earnings";
import Messages from "./pages/artisan/Messages";
import HelpCenter from "./pages/artisan/HelpCenter";
import BuyerAnalytics from "./pages/buyer/Analytics";
import BuyerEarnings from "./pages/buyer/Earnings";
import BuyerMessages from "./pages/buyer/Messages";
import AIStudio from "./pages/buyer/AIStudio";
import BuyerHelpCenter from "./pages/buyer/HelpCenter";
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
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route path="/auth/buyer-signup" element={<BuyerSignup />} />
          <Route path="/auth/artisan-signup" element={<ArtisanSignup />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/onboarding" element={<LocationLanguage />} />
          <Route path="/onboarding/location-language" element={<LocationLanguage />} />
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
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AllUsers /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin']}><AllProducts /></ProtectedRoute>} />
          <Route path="/admin/artisans" element={<ProtectedRoute allowedRoles={['admin']}><AllArtisans /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AllOrders /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
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
          <Route
            path="/artisan/analytics"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artisan/earnings"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <Earnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artisan/messages"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artisan/help"
            element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <HelpCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/analytics"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/earnings"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerEarnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/messages"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/ai-studio"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <AIStudio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/help"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerHelpCenter />
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
