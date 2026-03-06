'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureCardGroup, type Feature } from '@/components/landing/FeatureCard';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/ui/Header';
import { useAuthState } from '@/lib/hooks/useAuthState';
import { motion } from 'framer-motion';

/**
 * Landing page with professional design, improved spacing, and visual hierarchy
 */
export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthState();
  const [showContent, setShowContent] = useState(false);

  // Show content after a slight delay for smooth entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const features: Feature[] = [
    {
      title: 'Task Management',
      description: 'Create, organize, and track your tasks with ease. Set priorities, due dates, and reminders to stay on top of your workload.',
    },
    {
      title: 'Team Collaboration',
      description: 'Work together with your team in real-time. Share tasks, assign responsibilities, and track progress together.',
    },
    {
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security. End-to-end encryption ensures your information stays private.',
    },
    {
      title: 'Smart Analytics',
      description: 'Gain insights into your productivity patterns. Visualize your progress and identify areas for improvement.',
    },
    {
      title: 'Cross-Platform Sync',
      description: 'Access your tasks from anywhere. Seamless synchronization across all your devices.',
    },
    {
      title: 'Custom Workflows',
      description: 'Tailor the app to your needs. Create custom labels, filters, and views that match your workflow.',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Same as dashboard */}
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          headline="Manage Your Tasks Efficiently"
          subtitle="A modern task management application built for productivity. Streamline your workflow and boost your efficiency with our intuitive platform."
          primaryCta={{
            text: isAuthenticated ? 'Go to Dashboard' : 'Get Started',
            action: isAuthenticated ? '/dashboard' : '/signup',
            variant: 'primary',
            size: 'large',
          }}
          secondaryCta={{
            text: 'Learn More',
            action: '#features',
            variant: 'outline',
            size: 'large',
          }}
          showBackgroundPattern={true}
        />

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="section-title text-gray-900 dark:text-gray-100">
                Powerful Features for Your Productivity
              </h2>
              <p className="section-subtitle mt-4">
                Everything you need to organize your tasks and manage your time effectively.
              </p>
            </motion.div>

            <FeatureCardGroup features={features} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 gradient-bg opacity-90" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.1]" />
          
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl mb-6">
                Ready to Transform Your Productivity?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join thousands of satisfied users who have transformed the way they work.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-transparent text-white border-2 border-white/50 hover:bg-white/10 transition-all duration-200"
                >
                  Explore Features
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '1M+', label: 'Tasks Created' },
                { value: '99.9%', label: 'Uptime' },
                { value: '4.9/5', label: 'User Rating' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
