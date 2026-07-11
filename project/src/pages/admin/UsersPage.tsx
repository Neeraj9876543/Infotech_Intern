import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEye, FiEdit2, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { userService } from '../../services/userService';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface UserRow { id: string; name: string; email: string; role: string; phone?: string; joinedAt?: string; }

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState<UserRow | null>(null);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveEdit = async () => {
    if (!editing) return;
    try {
       const response = await userService.update(editing.id, { name: editName, phone: editPhone });
       if (response.data.success) {
         fetchUsers();
         setEditing(null);
       }
    } catch (error) {
       console.error('Error saving user edit:', error);
    }
  };

  return (
    <div>
      <PageHeader title="Users" subtitle={`${users.length} registered users`} breadcrumb="Admin" />
      <div className="max-w-sm mb-6">
        <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} icon={<FiSearch className="w-4 h-4" />} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Name</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Email</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Role</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Joined</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="bg-white hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-brand-600">{u.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{u.email}</td>
                    <td className="px-5 py-4"><Badge variant={u.role as 'admin' | 'customer'}>{u.role}</Badge></td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => setViewing(u)} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors" title="View"><FiEye className="w-4 h-4" /></button>
                        <button onClick={() => { setEditing(u); setEditName(u.name); setEditPhone(u.phone || ''); }} className="p-1.5 hover:bg-amber-50 text-amber-500 rounded-lg transition-colors" title="Edit"><FiEdit2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View modal */}
      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="User Details" size="sm">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-600">{viewing.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{viewing.name}</p>
                <Badge variant={viewing.role as 'admin' | 'customer'} size="sm">{viewing.role}</Badge>
              </div>
            </div>
            {[{ icon: FiUser, label: 'Name', value: viewing.name }, { icon: FiMail, label: 'Email', value: viewing.email }, { icon: FiPhone, label: 'Phone', value: viewing.phone || 'N/A' }].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><Icon className="w-4 h-4 text-gray-500" /></div>
                <div><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-medium text-gray-800">{value}</p></div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit User" size="sm"
        footer={<><button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="btn-primary" onClick={handleSaveEdit}>Save Changes</button></>}>
        <div className="space-y-4">
          <Input label="Name" value={editName} onChange={e => setEditName(e.target.value)} icon={<FiUser className="w-4 h-4" />} />
          <Input label="Phone" value={editPhone} onChange={e => setEditPhone(e.target.value)} icon={<FiPhone className="w-4 h-4" />} hint="Optional" />
        </div>
      </Modal>
    </div>
  );
}
