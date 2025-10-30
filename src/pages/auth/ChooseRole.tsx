import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ShoppingBag, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/BackButton';

const ChooseRole: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const roles = [
    {
      id: 'buyer',
      title: t('auth.buyer'),
      description: t('auth.buyerDescription'),
      icon: ShoppingBag,
      color: 'bg-blue-500',
      benefits: ['Discover authentic crafts', 'Support local artisans', 'Secure payments', 'Fast delivery'],
    },
    {
      id: 'artisan',
      title: t('auth.artisan'),
      description: t('auth.artisanDescription'),
      icon: Users,
      color: 'bg-green-500',
      benefits: ['Showcase your work', 'Direct customer connection', 'Fair pricing', 'Global reach'],
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage platform operations and oversee artisan community',
      icon: Shield,
      color: 'bg-purple-500',
      benefits: ['Platform oversight', 'Community management', 'Quality control', 'Analytics access'],
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    // Store selected role temporarily
    sessionStorage.setItem('selectedRole', roleId);
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="mb-6">
          <BackButton to="/" />
        </div>
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            {t('auth.chooseRole')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-gray-600"
          >
            Join our community of artisans and craft enthusiasts
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{role.title}</CardTitle>
                  <CardDescription className="text-sm">{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {role.benefits.map((benefit, benefitIndex) => (
                      <Badge key={benefitIndex} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleRoleSelect(role.id)}
                    className="w-full mt-auto group-hover:bg-primary/90 transition-colors duration-300"
                  >
                    Choose {role.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChooseRole;
