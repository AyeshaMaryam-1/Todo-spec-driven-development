# Frontend Data Model: UI Enhancement – Landing Page & Professional Interface

**Feature**: UI Enhancement – Landing Page & Professional Interface (Todo Application)
**Date**: 2026-02-12
**Status**: Complete

## Overview

This document defines the TypeScript data structures and component interfaces for the UI enhancement feature. These types ensure type safety across the new UI components while maintaining compatibility with existing application patterns.

## Component Prop Types

### Header Component

Represents the global navigation header with conditional rendering based on authentication status.

```typescript
/**
 * Props for the global Header component
 * Contains navigation items that change based on authentication status
 */
export interface HeaderProps {
  /**
   * Optional logo element to display in the header
   * @default Application name text
   */
  logo?: React.ReactNode

  /**
   * Navigation items to display on the right side of the header
   * These change based on authentication status
   */
  navItems: NavItem[]

  /**
   * Callback fired when a navigation item is clicked
   * Useful for analytics or custom behavior
   */
  onNavItemClick?: (item: NavItem) => void

  /**
   * Whether the header should be sticky at the top of the page
   * @default true
   */
  isSticky?: boolean

  /**
   * Additional CSS classes to apply to the header container
   */
  className?: string
}

/**
 * Represents a navigation item in the header
 */
export interface NavItem {
  /**
   * Display text for the navigation item
   */
  label: string

  /**
   * URL path for the navigation item
   */
  href: string

  /**
   * Optional icon to display alongside the label
   */
  icon?: React.ReactNode

  /**
   * Style variant for the navigation item
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'secondary' | 'ghost'

  /**
   * Whether this item should open in a new tab
   * @default false
   */
  external?: boolean

  /**
   * Optional badge or indicator to display on the item
   */
  badge?: string | number
}
```

**Fields**:
- `logo`: Custom logo element or defaults to app name
- `navItems`: Array of navigation items that change based on auth status
- `onNavItemClick`: Callback for navigation events
- `isSticky`: Whether header stays fixed at top
- `className`: Additional styling classes

**Validation Rules**:
- `label` must be non-empty string
- `href` must be valid URL path
- `navItems` must have at least one item

---

### Hero Section Component

Represents the prominent hero section on the landing page.

```typescript
/**
 * Props for the HeroSection component
 * Displays the main value proposition of the application
 */
export interface HeroSectionProps {
  /**
   * Main headline text for the hero section
   */
  headline: string

  /**
   * Supporting subtitle text that explains the headline
   */
  subtitle: string

  /**
   * Primary call-to-action button configuration
   */
  primaryCta: CtaButton

  /**
   * Secondary call-to-action button configuration
   * Optional - may not be needed depending on design
   */
  secondaryCta?: CtaButton

  /**
   * Optional image or graphic to display alongside the text
   */
  illustration?: React.ReactNode

  /**
   * Additional CSS classes to apply to the hero section container
   */
  className?: string
}

/**
 * Configuration for call-to-action buttons in the hero section
 */
export interface CtaButton {
  /**
   * Display text for the button
   */
  text: string

  /**
   * URL path or click handler for the button
   */
  action: string | (() => void)

  /**
   * Style variant for the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline'

  /**
   * Size variant for the button
   * @default 'default'
   */
  size?: 'small' | 'default' | 'large'

  /**
   * Whether the button should open in a new tab
   * Only applicable if action is a URL string
   * @default false
   */
  external?: boolean
}
```

**Fields**:
- `headline`: Main hero text
- `subtitle`: Supporting text
- `primaryCta`: Primary action button
- `secondaryCta`: Optional secondary action
- `illustration`: Optional visual element

**Validation Rules**:
- `headline` must be non-empty string
- `subtitle` must be non-empty string
- `primaryCta` must be provided

---

### Animation State Types

Types for managing animation states and transitions.

```typescript
/**
 * State for managing component animations
 */
export interface AnimationState {
  /**
   * Whether the component should be animated in
   */
  isVisible: boolean

  /**
   * Current animation stage
   */
  stage: 'idle' | 'entering' | 'entered' | 'exiting' | 'exited'

  /**
   * Animation duration in milliseconds
   */
  duration: number

  /**
   * Animation delay in milliseconds
   */
  delay: number
}

/**
 * Configuration for entrance animations
 */
export interface EntranceAnimationConfig {
  /**
   * Animation variant
   */
  type: 'fade' | 'slide-up' | 'slide-down' | 'scale'

  /**
   * Animation duration in milliseconds
   * @default 500
   */
  duration?: number

  /**
   * Animation delay in milliseconds
   * @default 0
   */
  delay?: number

  /**
   * Easing function for the animation
   * @default 'ease-out'
   */
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
}
```

**Fields**:
- `isVisible`: Animation trigger state
- `stage`: Current animation phase
- `duration`: Animation length
- `delay`: Animation start delay

---

### UI State Types

Types for managing UI states in the new components.

```typescript
/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * State for mobile menu toggle
 */
export interface MobileMenuState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

/**
 * State for hover effects
 */
export interface HoverState {
  isHovered: boolean
  setIsHovered: (isHovered: boolean) => void
}

/**
 * State for focus management
 */
export interface FocusState {
  isFocused: boolean
  setIsFocused: (isFocused: boolean) => void
}
```

**Fields**:
- `LoadingState`: Different states for async operations
- `MobileMenuState`: Toggle state for mobile navigation
- `HoverState`: Hover interaction state
- `FocusState`: Focus management state

---

## Responsive Design Types

Types for managing responsive layouts and breakpoints.

```typescript
/**
 * Breakpoint definitions for responsive design
 */
export interface Breakpoints {
  sm: number    // Small screens (mobile)
  md: number    // Medium screens (tablet)
  lg: number    // Large screens (desktop)
  xl: number    // Extra large screens
  '2xl': number // 2x extra large screens
}

/**
 * Responsive prop value that can change based on screen size
 */
export type ResponsiveValue<T> = T | {
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

/**
 * Container width configurations for different screen sizes
 */
export interface ContainerWidths {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl'?: string
}
```

**Fields**:
- `Breakpoints`: Numeric values for different screen sizes
- `ResponsiveValue`: Values that adapt to screen size
- `ContainerWidths`: Width constraints for different screens

---

## Accessibility Types

Types for ensuring accessibility compliance.

```typescript
/**
 * Accessibility properties for UI components
 */
export interface AriaProps {
  /**
   * Label for screen readers
   */
  'aria-label'?: string

  /**
   * Description for screen readers
   */
  'aria-describedby'?: string

  /**
   * Controls relationship for screen readers
   */
  'aria-controls'?: string

  /**
   * Expanded state for disclosure widgets
   */
  'aria-expanded'?: boolean

  /**
   * Hidden state for screen readers
   */
  'aria-hidden'?: boolean
}

/**
 * Focus management properties
 */
export interface FocusManagement {
  /**
   * Whether element should be focusable
   */
  tabIndex?: number

  /**
   * Focus visibility state
   */
  showFocusRing: boolean

  /**
   * Focus handler
   */
  onFocus?: (event: React.FocusEvent) => void

  /**
   * Blur handler
   */
  onBlur?: (event: React.FocusEvent) => void
}
```

**Fields**:
- `AriaProps`: WAI-ARIA attributes for accessibility
- `FocusManagement`: Focus handling and visibility

---

## Component Hierarchy

```
Header (Root Layout)
  ├── Logo
  ├── Navigation
  │   ├── Desktop Links
  │   └── Mobile Menu (Collapsible)
  │       ├── Sign In / Sign Up (Unauthenticated)
  │       └── Dashboard / Logout (Authenticated)
  └── Auth State Detector

Landing Page
  ├── Hero Section
  │   ├── Headline
  │   ├── Subtitle
  │   ├── Primary CTA
  │   └── Secondary CTA
  ├── Features Section (Future)
  ├── Testimonials Section (Future)
  └── Footer (Future)

Auth-Aware Navigation
  ├── useAuthState Hook
  │   ├── Session Detection
  │   ├── Loading State
  │   └── Error Handling
  └── Conditional Rendering
      ├── Unauthenticated State
      │   ├── Sign In Link
      │   └── Sign Up Link
      └── Authenticated State
          ├── Dashboard Link
          └── Logout Link
```

---

## Type Exports

All types should be exported from a central `types/index.ts` file:

```typescript
// types/index.ts
export * from './ui'
export * from './animation'
export * from './responsive'
export * from './accessibility'
```

---

## Integration Points

### With Existing Auth System
- Uses existing Better Auth hooks for authentication state
- Compatible with existing `useSession` hook
- Maintains existing session persistence

### With Existing Styling System
- Extends existing Tailwind CSS configuration
- Compatible with existing global styles
- Uses same color palette and typography

### With Existing Component Patterns
- Follows same component structure as existing components
- Compatible with existing layout patterns
- Maintains same error handling approach

---

## Validation Rules

### Component Props
- All required props must be provided
- String props must not be empty
- URL props must be valid paths
- Callback props must be functions
- Enum values must be from defined options

### State Management
- Animation states must follow valid transitions
- Loading states must be properly managed
- Error states must be handled gracefully
- Async operations must have proper cleanup

### Accessibility
- All interactive elements must be focusable
- ARIA labels must be provided for complex components
- Color contrast must meet WCAG AA standards
- Keyboard navigation must be fully supported