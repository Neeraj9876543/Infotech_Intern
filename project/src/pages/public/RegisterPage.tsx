import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface Errors { name?: string; email?: string; password?: string; confirm?: string; }

function validate(name: string, email: string, password: string, confirm: string): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = 'Name is required.';
  if (!email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (password !== confirm) errors.confirm = 'Passwords do not match.';
  return errors;
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(name, email, password, confirm);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const result = await register(name, email, password, role);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      showToast('Account created! Please sign in.', 'success');
      setTimeout(() => navigate('/login'), 2500);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6 pt-24">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle className="w-10 h-10 text-sage-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">You're all set!</h2>
          <p className="text-gray-500">Your account has been created. Redirecting you to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-24 bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">T</span>
              </div>
              <span className="font-serif font-semibold text-gray-900">TableMaestro</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-1">Join TableMaestro for effortless reservations.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} icon={<FiUser className="w-4 h-4" />} error={errors.name} />
            <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} icon={<FiMail className="w-4 h-4" />} error={errors.email} />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Choose Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all duration-200 text-center ${
                    role === 'customer'
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all duration-200 text-center ${
                    role === 'admin'
                      ? 'border-sage-500 bg-sage-50 text-sage-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} icon={<FiLock className="w-4 h-4" />} error={errors.password} />
            <Input label="Confirm Password" type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} icon={<FiLock className="w-4 h-4" />} error={errors.confirm} />
            <Button type="submit" className="w-full" loading={loading} icon={<FiArrowRight className="w-4 h-4" />}>Create Account</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
          </p>
        </motion.div>
      </div>
      <div className="hidden lg:flex flex-1 relative">
        <img src="https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Restaurant" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/50 flex flex-col justify-center items-start p-12">
          <div className="text-white max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold">T</span>
              </div>
              <span className="font-serif font-bold text-2xl">TableMaestro</span>
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4 leading-tight">Your table awaits</h2>
            <p className="text-white/70 leading-relaxed">Create an account to start booking tables, manage reservations, and enjoy exclusive member benefits.</p>
            <ul className="mt-6 space-y-2">
              {['Instant table reservations', 'Easy cancellation', 'Reservation history'].map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-white/80">
                  <FiCheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />{p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
