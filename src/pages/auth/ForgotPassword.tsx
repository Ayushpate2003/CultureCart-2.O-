import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement password reset with Appwrite
      // await account.createRecovery(email, `${window.location.origin}/auth/reset-password`);

      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSent(true);
      toast({
        title: 'Reset email sent!',
        description: 'Check your email for password reset instructions.',
      });
    } catch (error) {
      toast({
        title: 'Failed to send reset email',
        description: 'Please check your email address and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement resend with Appwrite
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Email resent!',
        description: 'Check your email for the reset link.',
      });
    } catch (error) {
      toast({
        title: 'Failed to resend',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-craft relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="forgot-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="currentColor" />
              <path d="M25 25 L75 25 L75 75 L25 75 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#forgot-pattern)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <Card className="shadow-warm border-2">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mb-4">
              {isSent ? (
                <CheckCircle className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Mail className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isSent ? 'Check Your Email' : 'Forgot Password?'}
            </CardTitle>
            <CardDescription>
              {isSent
                ? 'We\'ve sent password reset instructions to your email'
                : 'Enter your email address and we\'ll send you a reset link'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      Sending reset link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>

                  <Button
                    variant="outline"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      'Resend Email'
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
