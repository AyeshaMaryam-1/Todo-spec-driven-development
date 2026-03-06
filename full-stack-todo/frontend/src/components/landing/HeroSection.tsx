'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CtaButton {
  text: string;
  action: string | (() => void);
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'default' | 'large';
  external?: boolean;
}

interface HeroSectionProps {
  headline: string;
  subtitle: string;
  primaryCta: CtaButton;
  secondaryCta?: CtaButton;
  illustration?: React.ReactNode;
  className?: string;
  showBackgroundPattern?: boolean;
}

/**
 * HeroSection component with modern gradient design and animations
 */
export function HeroSection({
  headline,
  subtitle,
  primaryCta,
  secondaryCta,
  illustration,
  className,
  showBackgroundPattern = true,
}: HeroSectionProps) {
  const handleCtaAction = (cta: CtaButton) => {
    if (typeof cta.action === 'string') {
      // Don't navigate if it's a hash link (handled by browser)
      if (cta.action.startsWith('#')) {
        const element = document.querySelector(cta.action);
        element?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      window.location.href = cta.action;
    } else if (typeof cta.action === 'function') {
      cta.action();
    }
  };

  const getButtonClasses = (cta: CtaButton) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      cta.size === 'small' ? 'text-sm px-4 py-2' :
      cta.size === 'large' ? 'text-lg px-8 py-4' : 'text-base px-6 py-3',
      cta.variant === 'primary' || !cta.variant ? 'btn-primary' :
      cta.variant === 'secondary' ? 'btn-secondary' :
      'btn-outline'
    );
    return baseClasses;
  };

  return (
    <section className={cn('relative py-20 md:py-32 overflow-hidden', className)}>
      {/* Background Gradient */}
      {showBackgroundPattern && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
          
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse-slow" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
            Welcome to the future of task management
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="section-title gradient-text mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {headline}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="section-subtitle mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => handleCtaAction(primaryCta)}
              className={getButtonClasses(primaryCta)}
            >
              {primaryCta.text}
              {primaryCta.variant === 'primary' && (
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </button>

            {secondaryCta && (
              <button
                onClick={() => handleCtaAction(secondaryCta)}
                className={getButtonClasses(secondaryCta)}
              >
                {secondaryCta.text}
              </button>
            )}
          </motion.div>
        </div>

        {/* Illustration */}
        {illustration && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="flex justify-center">
              <div className="relative">
                {/* Shadow under illustration */}
                <div className="absolute inset-0 gradient-bg opacity-20 blur-3xl transform translate-y-8" />
                {illustration}
              </div>
            </div>
          </motion.div>
        )}

        {/* Trust indicators */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Trusted by productive teams worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse-slow" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}