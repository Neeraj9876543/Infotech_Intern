import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const icons = {
  success: <FiCheckCircle className="w-5 h-5" />,
  error: <FiAlertCircle className="w-5 h-5" />,
  info: <FiInfo className="w-5 h-5" />,
  warning: <FiAlertTriangle className="w-5 h-5" />,
};

const styles = {
  success: 'bg-sage-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-amber-500 text-white',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-modal pointer-events-auto min-w-[280px] max-w-[380px] ${styles[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="opacity-75 hover:opacity-100 transition-opacity">
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
