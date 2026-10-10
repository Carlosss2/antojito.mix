import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
              {icon}
            </div>
          )}
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <input
              ref={ref}
              id={inputId}
              className={`
                w-full rounded-2xl border-2 transition-all duration-200
                bg-white/80 backdrop-blur-sm
                text-text-primary placeholder-text-secondary
                focus:outline-none focus:ring-2 focus:ring-pink-300
                ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
                ${error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-300' : 'border-rose-100 focus:border-pink-300'}
                ${className}
              `}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              {...props}
            />
          </motion.div>
        </div>
        {error && (
          <motion.p
            id={`${inputId}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-sm text-rose-500 flex items-center gap-1"
            role="alert"
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';