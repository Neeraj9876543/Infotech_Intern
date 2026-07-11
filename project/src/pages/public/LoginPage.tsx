import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function validate(email: string, password: string) {
  if (!email) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(email, password);
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      showToast('Welcome back!', 'success');
      const isAdmin = result.user?.role === 'admin' || email.includes('admin');
      navigate(isAdmin ? '/admin/dashboard' : '/customer/dashboard');
    } else {
      setError(result.error || 'User not found. Please register first.');
      showToast(result.error || 'User not found. Please register first.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 relative">
        <img src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Restaurant" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/30 flex flex-col justify-end p-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold">T</span>
              </div>
              <span className="font-serif font-bold text-2xl text-white">TableMaestro</span>
            </div>
            <blockquote className="text-white/80 text-lg font-serif italic leading-relaxed">
              "Every table tells a story. Let us help you write yours."
            </blockquote>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-24 bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">T</span>
              </div>
              <span className="font-serif font-semibold text-gray-900">TableMaestro</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1">Sign in to manage your reservations.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} icon={<FiMail className="w-4 h-4" />} error={error} />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} icon={<FiLock className="w-4 h-4" />} />
            <Button type="submit" className="w-full" loading={loading} icon={<FiArrowRight className="w-4 h-4" />}>Sign In</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account? <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
