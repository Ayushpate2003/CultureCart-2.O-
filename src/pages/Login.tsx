import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { UserRole } from '@/stores/authStore';
import { Separator } from '@/components/ui/separator';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, loginWithGoogle, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to their dashboard or onboarding
    if (isAuthenticated && user) {
      const roleRoutes: Record<UserRole, string> = {
        admin: '/dashboard/admin',
        artisan: '/dashboard/artisan',
        buyer: '/dashboard/buyer',
      };
      navigate(roleRoutes[user.role], { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (useRedirect: boolean = false) => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Google.',
      });
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      // If popup was blocked, suggest redirect method
      if (error.message?.includes('blocked') || error.message?.includes('popup')) {
        toast({
          title: 'Pop-up blocked',
          description: 'Please allow pop-ups or try the redirect method.',
          variant: 'destructive',
        });
      } else if (error.message?.includes('unauthorized-domain')) {
        toast({
          title: 'Domain not authorized',
          description: 'This domain is not configured for Google Sign-In.',
          variant: 'destructive',
        });
      } else if (error.message?.includes('operation-not-allowed')) {
        toast({
          title: 'Google Sign-In disabled',
          description: 'Google Sign-In is not enabled in Firebase Console.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Google sign in failed',
          description: error.message || 'Please try again or use email/password login.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-craft relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="warli" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="currentColor" />
              <line x1="50" y1="35" x2="50" y2="65" stroke="currentColor" strokeWidth="1" />
              <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#warli)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <Card className="shadow-warm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-hero rounded-full">
                <ShoppingBag className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl">Welcome to CultureCart</CardTitle>
            <CardDescription>
              Sign in to discover authentic Indian crafts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-hero"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in with Google...
                  </>
                ) : (
                  'Continue with Google'
                )}
              </Button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/choose-role" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <Link to="/auth/forgot-password" className="text-primary hover:underline">
                    Forgot your password?
                  </Link>
                </p>
              </div>
            </div>


          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
