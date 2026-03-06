// UI Component Contracts: UI Enhancement – Landing Page & Professional Interface

/**
 * Contract for the Header component
 *
 * Responsibilities:
 * - Display navigation items based on authentication status
 * - Provide sticky positioning at top of page
 * - Handle responsive behavior for mobile devices
 * - Manage mobile menu toggle functionality
 *
 * Dependencies:
 * - Better Auth session state for conditional rendering
 * - Router for navigation
 * - Tailwind CSS for styling
 */
export interface HeaderContract {
  /**
   * Component accepts HeaderProps as input
   */
  props: HeaderProps

  /**
   * Renders a sticky header with appropriate navigation items
   * - Unauthenticated: Sign In / Sign Up links
   * - Authenticated: Dashboard / Logout links
   */
  render(): JSX.Element

  /**
   * Handles navigation item clicks
   * - Tracks analytics if callback provided
   * - Performs navigation to specified href
   * - Closes mobile menu if open
   */
  handleNavigation(item: NavItem): void

  /**
   * Toggles mobile menu visibility
   * - Only applicable on mobile viewports
   * - Updates internal state
   */
  toggleMobileMenu(): void

  /**
   * Monitors authentication state
   * - Updates navigation items when auth status changes
   * - Ensures correct links are displayed
   */
  monitorAuthState(): void
}

/**
 * Contract for the HeroSection component
 *
 * Responsibilities:
 * - Display prominent headline and subtitle
 * - Render call-to-action buttons
 * - Handle responsive layout for different viewports
 * - Implement entrance animations
 *
 * Dependencies:
 * - Tailwind CSS for styling
 * - Animation utilities for entrance effects
 */
export interface HeroSectionContract {
  /**
   * Component accepts HeroSectionProps as input
   */
  props: HeroSectionProps

  /**
   * Renders hero section with headline, subtitle, and CTAs
   * - Properly styled according to design specifications
   * - Responsive layout for all viewport sizes
   */
  render(): JSX.Element

  /**
   * Handles primary CTA action
   * - Navigates to specified URL or executes callback
   * - Tracks interaction if analytics available
   */
  handlePrimaryCta(): void

  /**
   * Handles secondary CTA action
   * - Navigates to specified URL or executes callback
   * - Tracks interaction if analytics available
   */
  handleSecondaryCta(): void

  /**
   * Manages entrance animation
   * - Initializes animation when component enters viewport
   * - Applies specified animation type and duration
   * - Respects user's reduced motion preferences
   */
  manageEntranceAnimation(): void

  /**
   * Handles responsive behavior
   * - Adjusts layout for different screen sizes
   * - Maintains readability and usability
   */
  handleResponsiveLayout(): void
}

/**
 * Contract for the AuthAwareNav component
 *
 * Responsibilities:
 * - Conditionally render navigation based on authentication status
 * - Handle sign in/out operations
 * - Maintain consistent styling with header
 *
 * Dependencies:
 * - Better Auth for session detection
 * - Router for navigation
 */
export interface AuthAwareNavContract {
  /**
   * Component accepts no specific props, relies on auth state
   */
  props: {}

  /**
   * Renders appropriate navigation items based on auth status
   * - Unauthenticated: Sign In / Sign Up buttons
   * - Authenticated: Dashboard / Logout buttons
   */
  render(): JSX.Element

  /**
   * Detects authentication state
   * - Uses Better Auth hooks to determine status
   * - Updates UI when auth state changes
   */
  detectAuthState(): void

  /**
   * Handles sign in action
   * - Initiates Better Auth sign in flow
   * - Navigates to appropriate page after success
   */
  handleSignIn(): void

  /**
   * Handles sign up action
   * - Initiates Better Auth sign up flow
   * - Navigates to appropriate page after success
   */
  handleSignUp(): void

  /**
   * Handles dashboard navigation
   * - Navigates to user dashboard
   * - Preserves any necessary state
   */
  handleDashboard(): void

  /**
   * Handles logout action
   * - Initiates Better Auth logout flow
   * - Clears session data
   * - Navigates to appropriate page after success
   */
  handleLogout(): void
}

/**
 * Contract for the useAuthState hook
 *
 * Responsibilities:
 * - Monitor authentication state using Better Auth
 * - Provide consistent interface for auth status
 * - Handle loading and error states
 *
 * Dependencies:
 * - Better Auth hooks
 */
export interface UseAuthStateContract {
  /**
   * Returns authentication state object
   */
  returns: {
    isAuthenticated: boolean
    isLoading: boolean
    error: Error | null
    user: User | null
  }

  /**
   * Initializes auth state monitoring
   * - Subscribes to Better Auth state changes
   * - Sets initial loading state
   */
  initialize(): void

  /**
   * Updates state when auth status changes
   * - Checks session status
   * - Updates isAuthenticated flag
   * - Updates user data if available
   */
  updateOnAuthChange(): void

  /**
   * Handles authentication errors
   * - Sets error state when auth issues occur
   * - Provides error details for consumers
   */
  handleError(error: Error): void
}

/**
 * Contract for the EntranceAnimation component/utility
 *
 * Responsibilities:
 * - Apply entrance animations to UI elements
 * - Respect user's reduced motion preferences
 * - Provide consistent animation experience
 *
 * Dependencies:
 * - CSS transitions and transforms
 * - Intersection Observer API for viewport detection
 */
export interface EntranceAnimationContract {
  /**
   * Accepts animation configuration and child element
   */
  props: {
    config: EntranceAnimationConfig
    children: React.ReactNode
    triggerOnce?: boolean
  }

  /**
   * Renders children with applied animation
   * - Applies specified animation type
   * - Respects duration and delay settings
   */
  render(): JSX.Element

  /**
   * Monitors element visibility
   * - Uses Intersection Observer to detect when element enters viewport
   * - Triggers animation when visible
   */
  monitorVisibility(): void

  /**
   * Applies animation styles
   * - Adds appropriate CSS classes for animation
   * - Respects user's reduced motion preferences
   */
  applyAnimation(): void

  /**
   * Cleans up observers and event listeners
   * - Removes Intersection Observer when component unmounts
   * - Prevents memory leaks
   */
  cleanup(): void
}

/**
 * Contract for the ResponsiveContainer component
 *
 * Responsibilities:
 * - Adapt layout based on viewport size
 * - Apply appropriate styling for different breakpoints
 * - Maintain consistent user experience across devices
 *
 * Dependencies:
 * - Window resize event listeners
 * - Tailwind CSS responsive utilities
 */
export interface ResponsiveContainerContract {
  /**
   * Accepts responsive configuration and child content
   */
  props: {
    children: React.ReactNode
    maxWidth?: ResponsiveValue<string>
    padding?: ResponsiveValue<string>
    className?: string
  }

  /**
   * Renders container with responsive styling
   * - Applies appropriate classes based on viewport
   * - Maintains consistent layout principles
   */
  render(): JSX.Element

  /**
   * Monitors viewport size changes
   * - Responds to window resize events
   * - Updates styling when breakpoints are crossed
   */
  monitorViewport(): void

  /**
   * Applies responsive styles
   * - Uses Tailwind CSS responsive prefixes
   * - Falls back to default styles when needed
   */
  applyResponsiveStyles(): void

  /**
   * Cleans up event listeners
   * - Removes resize listener when component unmounts
   */
  cleanup(): void
}