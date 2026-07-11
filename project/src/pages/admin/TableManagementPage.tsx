import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { useTables } from '../../context/TableContext';
import { RestaurantTable, TableStatus } from '../../data/tables';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface TableFormData { number: string; capacity: string; location: string; status: TableStatus; }

const defaultForm: TableFormData = { number: '', capacity: '', location: 'Main Hall', status: 'available' };
const LOCATIONS = ['Main Hall', 'Window', 'Patio', 'Private Room', 'Bar Area'];

function TableCard({ table, onEdit, onDelete }: { table: RestaurantTable; onEdit: (t: RestaurantTable) => void; onDelete: (id: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const statusColors = { available: 'bg-sage-50 border-sage-200', reserved: 'bg-amber-50 border-amber-200', maintenance: 'bg-gray-50 border-gray-200' };
  return (
    <>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl border-2 p-5 ${statusColors[table.status]} transition-all duration-200 hover:shadow-card`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-serif font-bold text-2xl text-gray-900">Table {table.number}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{table.location}</p>
          </div>
          <Badge variant={table.status}>{table.status}</Badge>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
          <FiUsers className="w-4 h-4 text-gray-400" />
          <span>Capacity: <span className="font-semibold">{table.capacity}</span></span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(table)} className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600 flex items-center justify-center gap-1.5">
            <FiEdit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={() => setConfirmDelete(true)} className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-red-100 bg-white hover:bg-red-50 transition-colors text-red-500 flex items-center justify-center gap-1.5">
            <FiTrash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      </motion.div>
      <ConfirmDialog isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={() => { onDelete(table.id); setConfirmDelete(false); }}
        title="Remove Table" message={`Are you sure you want to remove Table ${table.number}? This cannot be undone.`} confirmLabel="Remove Table" />
    </>
  );
}

export default function TableManagementPage() {
  const { tables, addTable, updateTable, deleteTable } = useTables();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [form, setForm] = useState<TableFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<TableFormData>>({});

  const validateForm = () => {
    const e: Partial<TableFormData> = {};
    if (!form.number || isNaN(Number(form.number))) e.number = 'Enter a valid table number.';
    if (!form.capacity || Number(form.capacity) < 1) e.capacity = 'Capacity must be at least 1.';
    return e;
  };

  const openAdd = () => { setEditingTable(null); setForm(defaultForm); setErrors({}); setModalOpen(true); };
  const openEdit = (t: RestaurantTable) => { setEditingTable(t); setForm({ number: String(t.number), capacity: String(t.capacity), location: t.location, status: t.status }); setErrors({}); setModalOpen(true); };

  const handleSave = async () => {
    const errs = validateForm();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editingTable) {
      const success = await updateTable(editingTable.id, { number: Number(form.number), capacity: Number(form.capacity), location: form.location, status: form.status });
      if (success) {
        showToast('Table updated.', 'success');
        setModalOpen(false);
      } else {
        showToast('Unable to update table right now.', 'error');
      }
      return;
    }

    const success = await addTable({ number: Number(form.number), capacity: Number(form.capacity), location: form.location, status: form.status });
    if (success) {
      showToast('Table added.', 'success');
      setModalOpen(false);
    } else {
      showToast('Unable to add table right now.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteTable(id);
    if (success) {
      showToast('Table removed.', 'info');
    } else {
      showToast('Unable to remove table right now.', 'error');
    }
  };

  const grouped = LOCATIONS.map(loc => ({ loc, items: tables.filter(t => t.location === loc) })).filter(g => g.items.length > 0);
  const ungrouped = tables.filter(t => !LOCATIONS.includes(t.location));

  return (
    <div>
      <PageHeader title="Table Management" subtitle={`${tables.length} tables · ${tables.filter(t => t.status === 'available').length} available`} breadcrumb="Admin"
        action={<Button icon={<FiPlus className="w-4 h-4" />} onClick={openAdd}>Add Table</Button>} />
      {[...grouped, ...(ungrouped.length ? [{ loc: 'Other', items: ungrouped }] : [])].map(({ loc, items }) => (
        <div key={loc} className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{loc}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(t => <TableCard key={t.id} table={t} onEdit={openEdit} onDelete={handleDelete} />)}
          </div>
        </div>
      ))}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTable ? 'Edit Table' : 'Add Table'} size="sm"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>{editingTable ? 'Save Changes' : 'Add Table'}</Button></>}>
        <div className="space-y-4">
          <Input label="Table Number" type="number" min="1" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} error={errors.number} />
          <Input label="Capacity" type="number" min="1" max="30" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} error={errors.capacity} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select className="input-field" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as TableStatus })}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
