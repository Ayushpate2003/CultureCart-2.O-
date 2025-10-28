import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/stores/authStore';
import { motion } from 'framer-motion';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  location: z.string().optional(),
  craftType: z.string().optional(),
  experience: z.number().optional(),
  portfolio: z.string().url().optional().or(z.literal('')),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
  privacy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
  marketing: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  selectedRole?: UserRole;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ selectedRole }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { signup, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(selectedRole || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      terms: false,
      privacy: false,
      marketing: false,
    },
  });

  const watchRole = watch('craftType'); // We'll use this to show/hide artisan fields

  useEffect(() => {
    // Get role from session storage if not provided
    if (!currentRole) {
      const storedRole = sessionStorage.getItem('selectedRole') as UserRole;
      if (storedRole) {
        setCurrentRole(storedRole);
      }
    }
  }, [currentRole]);

  useEffect(() => {
    // Clear error when component unmounts or when user starts typing
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      if (!currentRole) {
        alert('Please select a role first');
        return;
      }

      await signup({
        email: data.email,
        password: data.password,
        name: data.fullName,
        role: currentRole,
        phone: data.phone,
        location: data.location,
        craftType: data.craftType,
        experience: data.experience,
        portfolio: data.portfolio || undefined,
      });

      // Redirect to onboarding or dashboard
      navigate('/onboarding');
    } catch (error) {
      // Error is handled by the auth store
    }
  };

  const isArtisan = currentRole === 'artisan';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('auth.signup')}</CardTitle>
          <CardDescription>
            {currentRole && (
              <span className="capitalize">
                Sign up as {currentRole}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('auth.fullName')}</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Optional Fields */}
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t('auth.location')}</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Enter your location"
              />
            </div>

            {/* Artisan-specific fields */}
            {isArtisan && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="craftType">{t('auth.craftType')}</Label>
                  <Input
                    id="craftType"
                    {...register('craftType')}
                    placeholder="e.g., Pottery, Textile, Jewelry"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">{t('auth.experience')}</Label>
                  <Input
                    id="experience"
                    type="number"
                    {...register('experience', { valueAsNumber: true })}
                    placeholder="Years of experience"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">{t('auth.portfolio')}</Label>
                  <Input
                    id="portfolio"
                    {...register('portfolio')}
                    placeholder="https://your-portfolio.com"
                  />
                </div>
              </>
            )}

            {/* Agreements */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" {...register('terms')} />
                <Label htmlFor="terms" className="text-sm">
                  {t('auth.terms')}
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms.message}</p>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox id="privacy" {...register('privacy')} />
                <Label htmlFor="privacy" className="text-sm">
                  {t('auth.privacy')}
                </Label>
              </div>
              {errors.privacy && (
                <p className="text-sm text-red-600">{errors.privacy.message}</p>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox id="marketing" {...register('marketing')} />
                <Label htmlFor="marketing" className="text-sm">
                  {t('auth.marketing')}
                </Label>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                t('auth.createAccount')
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <button
                onClick={() => navigate('/auth/login')}
                className="text-primary hover:underline font-medium"
              >
                {t('auth.signInInstead')}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SignUpForm;
