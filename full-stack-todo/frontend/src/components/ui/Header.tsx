'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth'; // Using the existing auth implementation
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  external?: boolean;
  badge?: string | number;
}

interface HeaderProps {
  logo?: React.ReactNode;
  navItems?: NavItem[];
  onNavItemClick?: (item: NavItem) => void;
  isSticky?: boolean;
  className?: string;
}

/**
 * Global Header component with dynamic navigation based on auth status
 */
export function Header({
  logo = <span className="text-xl font-bold text-blue-600">Todo App</span>,
  navItems,
  onNavItemClick,
  isSticky = true,
  className
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession(); // Using existing auth hook
  const isAuthenticated = status === 'authenticated';

  // Use provided navItems or generate based on auth status
  const items: NavItem[] = navItems || (isAuthenticated
    ? [
        { label: 'Dashboard', href: '/dashboard', variant: 'primary' },
        { label: 'Logout', href: '#', variant: 'ghost' }
      ]
    : [
        { label: 'Sign In', href: '/signin', variant: 'ghost' },
        { label: 'Sign Up', href: '/signup', variant: 'primary' }
      ]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when resizing to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle navigation item click
  const handleNavClick = (item: NavItem) => {
    if (onNavItemClick) {
      onNavItemClick(item);
    }

    // Handle logout specifically
    if (item.label === 'Logout') {
      event?.preventDefault();
      // Using the existing signOut function from auth
      import('@/lib/auth').then(({ auth }) => {
        auth.signOut();
      });
    }
  };

  return (
    <header
      className={cn(
        'bg-white dark:bg-gray-900 shadow-sm z-10 border-b border-gray-200 dark:border-gray-800',
        isSticky ? 'sticky top-0' : '',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold gradient-text">
              {logo}
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex md:items-center md:space-x-4">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={(e) => {
                  if (item.label === 'Logout') {
                    e.preventDefault();
                    handleNavClick(item);
                  } else {
                    handleNavClick(item);
                  }
                }}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  item.variant === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : item.variant === 'secondary'
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                    : item.variant === 'ghost'
                    ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400',
                  'transition-transform duration-200 hover:scale-105'
                )}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button - Shown only on mobile */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Shown only when mobile menu is open */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={(e) => {
                  if (item.label === 'Logout') {
                    e.preventDefault();
                    handleNavClick(item);
                  } else {
                    handleNavClick(item);
                  }
                  setIsMobileMenuOpen(false); // Close menu after selection
                }}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium w-full text-left',
                  item.variant === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : item.variant === 'secondary'
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                    : item.variant === 'ghost'
                    ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}