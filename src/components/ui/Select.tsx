import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'ref'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
            <select
              ref={ref}
              id={selectId}
              className={`
                w-full rounded-2xl border-2 transition-all duration-200
                bg-white/80 backdrop-blur-sm appearance-none
                text-text-primary
                focus:outline-none focus:ring-2 focus:ring-pink-300
                pl-4 pr-10 py-3
                ${error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-300' : 'border-rose-100 focus:border-pink-300'}
                ${className}
              `}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji ? `${option.emoji} ` : ''}{option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>
        </div>
        {error && (
          <motion.p
            id={`${selectId}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-sm text-rose-500 flex items-center gap-1"
            role="alert"
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';