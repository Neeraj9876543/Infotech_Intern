export const mockUsers = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'customer', phone: '+1 555-0101', joinedAt: '2024-01-15' },
  { id: 'u2', name: 'Bob Martinez', email: 'bob@example.com', role: 'customer', phone: '+1 555-0102', joinedAt: '2024-02-20' },
  { id: 'u3', name: 'Carol White', email: 'carol@example.com', role: 'customer', phone: '+1 555-0103', joinedAt: '2024-03-10' },
  { id: 'u4', name: 'David Kim', email: 'david@example.com', role: 'customer', phone: '+1 555-0104', joinedAt: '2024-04-05' },
  { id: 'u5', name: 'Eva Chen', email: 'eva@example.com', role: 'customer', phone: '+1 555-0105', joinedAt: '2024-05-18' },
  { id: 'admin1', name: 'Marco Rossi', email: 'admin@tableaestro.com', role: 'admin', phone: '+1 555-9001', joinedAt: '2023-12-01' },
];

export const demoCustomer = { id: 'demo-customer', name: 'Demo Customer', email: 'demo@customer.com', role: 'customer' as const, phone: '+1 555-0000', joinedAt: '2024-06-01' };
export const demoAdmin = { id: 'demo-admin', name: 'Demo Admin', email: 'demo@admin.com', role: 'admin' as const, phone: '+1 555-9999', joinedAt: '2023-11-01' };
