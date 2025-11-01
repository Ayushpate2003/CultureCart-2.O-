import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { lazy, Suspense, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { useAuthStore } from "./stores/authStore";

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const ChooseRole = lazy(() => import("./pages/auth/ChooseRole"));
const BuyerSignup = lazy(() => import("./pages/auth/BuyerSignup"));
const ArtisanSignup = lazy(() => import("./pages/auth/ArtisanSignup"));
// const AdminSignup = lazy(() => import("./pages/auth/AdminSignup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const Terms = lazy(() => import("./pages/auth/Terms"));
const Privacy = lazy(() => import("./pages/auth/Privacy"));
const SignUpForm = lazy(() => import("./components/auth/SignUpForm"));
const Explore = lazy(() => import("./pages/Explore"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const LocationLanguage = lazy(() => import("./pages/onboarding/LocationLanguage"));
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));
const AllUsers = lazy(() => import("./pages/admin/AllUsers"));
const AllProducts = lazy(() => import("./pages/admin/AllProducts"));
const AllArtisans = lazy(() => import("./pages/admin/AllArtisans"));
const AllOrders = lazy(() => import("./pages/admin/AllOrders"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const ArtisanDashboard = lazy(() => import("./pages/dashboard/ArtisanDashboard"));
const BuyerDashboard = lazy(() => import("./pages/dashboard/BuyerDashboard"));
const UploadCraft = lazy(() => import("./pages/artisan/UploadCraft"));
const MyProducts = lazy(() => import("./pages/artisan/MyProducts"));
const Orders = lazy(() => import("./pages/artisan/Orders"));
const ProfileSettings = lazy(() => import("./pages/artisan/ProfileSettings"));
const Analytics = lazy(() => import("./pages/artisan/Analytics"));
const Earnings = lazy(() => import("./pages/artisan/Earnings"));
const Messages = lazy(() => import("./pages/artisan/Messages"));
const HelpCenter = lazy(() => import("./pages/artisan/HelpCenter"));
const BuyerAnalytics = lazy(() => import("./pages/buyer/Analytics"));
const BuyerEarnings = lazy(() => import("./pages/buyer/Earnings"));
const BuyerMessages = lazy(() => import("./pages/buyer/Messages"));
const AIStudio = lazy(() => import("./pages/buyer/AIStudio"));
const BuyerHelpCenter = lazy(() => import("./pages/buyer/HelpCenter"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  
  useEffect(() => {
    try {
      initializeAuth();
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  }, [initializeAuth]);
  
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthInitializer>
          <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          </div>
        }>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route path="/auth/buyer-signup" element={<BuyerSignup />} />
          <Route path="/auth/artisan-signup" element={<ArtisanSignup />} />
          {/* <Route path="/auth/admin-signup" element={<AdminSignup />} /> */}
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
        </Suspense>
          </BrowserRouter>
        </AuthInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
