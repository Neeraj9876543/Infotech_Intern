import { ReactNode } from 'react';
import { FiInbox } from 'react-icons/fi';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ title = 'Nothing here yet', message, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4 text-brand-400">
        {icon || <FiInbox className="w-8 h-8" />}
      </div>
      <h3 className="font-serif text-xl text-gray-700 mb-2">{title}</h3>
      {message && <p className="text-sm text-gray-400 max-w-xs">{message}</p>}
      {action && (
        <Button className="mt-5" onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
