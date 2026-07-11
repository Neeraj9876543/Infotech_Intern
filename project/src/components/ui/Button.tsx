import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 font-medium px-4 py-2 rounded-xl transition-all duration-200 active:scale-95',
  outline: 'border border-brand-400 text-brand-600 hover:bg-brand-50 font-semibold px-6 py-3 rounded-xl transition-all duration-200 active:scale-95',
};

const sizeClasses: Record<string, string> = {
  sm: '!px-3 !py-1.5 !text-sm',
  md: '',
  lg: '!px-8 !py-4 !text-lg',
};

export default function Button({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} inline-flex items-center justify-center gap-2`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
}
