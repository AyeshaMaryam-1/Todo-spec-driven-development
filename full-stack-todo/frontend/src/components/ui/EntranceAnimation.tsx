'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EntranceAnimationConfig {
  type: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  duration?: number;
  delay?: number;
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

interface EntranceAnimationProps {
  config: EntranceAnimationConfig;
  children: React.ReactNode;
  triggerOnce?: boolean;
  className?: string;
}

/**
 * Component that applies entrance animations to its children
 */
export function EntranceAnimation({
  config,
  children,
  triggerOnce = true,
  className
}: EntranceAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasAnimated(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current && !hasAnimated) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [triggerOnce, hasAnimated]);

  // Define animation variants based on config
  const getVariants = () => {
    const duration = config.duration || 0.5;
    const delay = config.delay || 0;

    switch (config.type) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration, delay }
          }
        };
      case 'slide-up':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay }
          }
        };
      case 'slide-down':
        return {
          hidden: { opacity: 0, y: -20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay }
          }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration, delay }
          }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration, delay } }
        };
    }
  };

  const variants = getVariants();

  return (
    <div ref={ref} className={className}>
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={variants}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}