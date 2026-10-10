import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-3xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-glass hover:shadow-glass-lg focus:ring-pink-300',
      secondary: 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-glass hover:shadow-glass-lg focus:ring-purple-300',
      outline: 'border-2 border-pink-300 text-pink-600 bg-white/80 hover:bg-pink-50 focus:ring-pink-300',
      ghost: 'text-pink-600 hover:bg-pink-50 focus:ring-pink-300',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <motion.span
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';