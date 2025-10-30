import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BackButton } from '@/components/BackButton';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const token = searchParams.get('token');
  const mode = searchParams.get('mode') || 'verify'; // 'verify' or 'reset'

  useEffect(() => {
    // If we have a token, try to verify automatically
    if (token && mode === 'verify') {
      handleAutoVerify();
    }
  }, [token, mode]);

  const handleAutoVerify = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement email verification with Appwrite
      // await account.updateVerification(token);

      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsVerified(true);
      toast({
        title: 'Email verified!',
        description: 'Your account has been successfully verified.',
      });

      // Redirect to onboarding after a delay
      setTimeout(() => {
        navigate('/onboarding/location-language');
      }, 2000);
    } catch (error) {
      setError('Verification link is invalid or has expired.');
      toast({
        title: 'Verification failed',
        description: 'The verification link is invalid or has expired.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement OTP verification with Appwrite
      // await account.updateVerification(userId, otp);

      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsVerified(true);
      toast({
        title: 'Email verified!',
        description: 'Your account has been successfully verified.',
      });

      // Redirect to onboarding after a delay
      setTimeout(() => {
        navigate('/onboarding/location-language');
      }, 2000);
    } catch (error) {
      setError('Invalid verification code. Please try again.');
      toast({
        title: 'Verification failed',
        description: 'Invalid verification code. Please check and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement resend verification with Appwrite
      // await account.createVerification(`${window.location.origin}/auth/verify-email`);

      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Code sent!',
        description: 'A new verification code has been sent to your email.',
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

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-craft relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-4"
        >
          <Card className="shadow-warm border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
                <p className="text-muted-foreground mb-6">
                  Your account has been successfully verified. Redirecting you to complete your profile...
                </p>
                <div className="animate-spin mx-auto w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-craft relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="verify-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="currentColor" />
              <path d="M35 35 L65 35 L65 65 L35 65 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#verify-pattern)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <div className="mb-6">
          <BackButton to="/login" />
        </div>
        <Card className="shadow-warm border-2">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">
              {mode === 'reset' ? 'Reset Password' : 'Verify Your Email'}
            </CardTitle>
            <CardDescription>
              {mode === 'reset'
                ? 'Enter the verification code sent to your email to reset your password'
                : 'Check your email for a verification code to activate your account'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {token && mode === 'verify' ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Verifying your email address...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">
                    {mode === 'reset' ? 'Reset Code' : 'Verification Code'}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Enter the code sent to your email
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-hero"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    mode === 'reset' ? 'Reset Password' : 'Verify Email'
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Code
                </Button>
              </div>


            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
