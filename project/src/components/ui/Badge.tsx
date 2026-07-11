import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'confirmed' | 'cancelled' | 'completed' | 'available' | 'reserved' | 'maintenance' | 'admin' | 'customer' | 'default';
  size?: 'sm' | 'md';
}

const variants: Record<string, string> = {
  confirmed: 'bg-sage-100 text-sage-700 border border-sage-200',
  completed: 'bg-blue-100 text-blue-700 border border-blue-200',
  cancelled: 'bg-red-100 text-red-600 border border-red-200',
  available: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  reserved: 'bg-amber-100 text-amber-700 border border-amber-200',
  maintenance: 'bg-gray-100 text-gray-600 border border-gray-200',
  admin: 'bg-brand-100 text-brand-700 border border-brand-200',
  customer: 'bg-blue-100 text-blue-700 border border-blue-200',
  default: 'bg-gray-100 text-gray-600 border border-gray-200',
};

export default function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center font-medium rounded-full capitalize ${sizeClass} ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}
