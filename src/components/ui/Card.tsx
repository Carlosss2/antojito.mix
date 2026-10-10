import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'glass', padding = 'md', hover = false, children, className = '', ...props }, ref) => {
    const variants = {
      default: 'bg-white/80 border border-white/40 shadow-xl shadow-rose-100/50',
      glass: 'backdrop-blur-md bg-white/70 border border-white/40 shadow-xl shadow-rose-100/50',
      elevated: 'bg-white border border-rose-100 shadow-2xl shadow-rose-100/30',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4, boxShadow: '0 35px 60px -15px rgba(244, 114, 182, 0.2)' } : undefined}
        transition={{ duration: 0.3 }}
        className={`${variants[variant]} ${paddings[padding]} rounded-3xl ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';