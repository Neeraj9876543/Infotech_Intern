import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiEdit2, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/ui/PageHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function CustomerProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [nameError, setNameError] = useState('');

  const handleSave = () => {
    if (!name.trim()) { setNameError('Name is required.'); return; }
    setNameError('');
    updateProfile({ name, phone });
    setEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your personal information." breadcrumb="Customer" />
      <div className="max-w-xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card mb-4">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center">
              <span className="text-2xl font-bold font-serif text-brand-600">{user?.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="font-serif font-semibold text-xl text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <div className="mt-1.5"><Badge variant={user?.role as 'customer' | 'admin'} size="sm">{user?.role}</Badge></div>
            </div>
          </div>
          {editing ? (
            <div className="space-y-4">
              <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} error={nameError} icon={<FiUser className="w-4 h-4" />} />
              <Input label="Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} icon={<FiPhone className="w-4 h-4" />} hint="Optional" />
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} icon={<FiCheckCircle className="w-4 h-4" />}>Save Changes</Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { icon: FiUser, label: 'Full Name', value: user?.name },
                { icon: FiMail, label: 'Email', value: user?.email },
                { icon: FiPhone, label: 'Phone', value: user?.phone || 'Not set' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline" icon={<FiEdit2 className="w-4 h-4" />} onClick={() => setEditing(true)}>Edit Profile</Button>
                <Button variant="ghost" icon={<FiLogOut className="w-4 h-4" />} className="!text-red-500 hover:!bg-red-50" onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          )}
        </motion.div>
        {user?.joinedAt && (
          <p className="text-xs text-gray-400 text-center">Member since {new Date(user.joinedAt + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        )}
      </div>
    </div>
  );
}
