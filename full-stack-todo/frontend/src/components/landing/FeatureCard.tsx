'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  index?: number;
  className?: string;
}

/**
 * FeatureCard component with hover effects and animations
 */
export function FeatureCard({
  title,
  description,
  icon,
  index = 0,
  className,
}: FeatureCardProps) {
  const defaultIcons = [
    // Task Management
    <svg key="task" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>,
    // Team Collaboration
    <svg key="team" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>,
    // Security
    <svg key="security" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>,
  ];

  return (
    <motion.div
      className={cn('card p-6 md:p-8', className)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      {/* Icon Container */}
      <div className="relative">
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white shadow-lg">
          {icon || defaultIcons[index % defaultIcons.length]}
        </div>
        {/* Decorative ring */}
        <div className="absolute inset-0 rounded-xl gradient-bg opacity-20 blur-lg scale-110" />
      </div>

      {/* Content */}
      <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>

      {/* Hover indicator */}
      <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Learn more</span>
        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
}

/**
 * FeatureCardGroup for rendering multiple cards with staggered animations
 */
export interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeatureCardGroupProps {
  features: Feature[];
  className?: string;
}

export function FeatureCardGroup({ features, className }: FeatureCardGroupProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          index={index}
          className="group"
        />
      ))}
    </div>
  );
}
