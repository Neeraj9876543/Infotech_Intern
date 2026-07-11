import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RestaurantTable, TableStatus } from '../data/tables';
import { tableService } from '../services/tableService';

interface TableContextType {
  tables: RestaurantTable[];
  addTable: (data: Omit<RestaurantTable, 'id'>) => Promise<boolean>;
  updateTable: (id: string, data: Partial<RestaurantTable>) => Promise<boolean>;
  deleteTable: (id: string) => Promise<boolean>;
  availableCount: number;
}

const TableContext = createContext<TableContextType | null>(null);

const mapBackendTable = (item: any): RestaurantTable => ({
  id: item._id || item.id,
  number: Number(item.tableNumber),
  capacity: Number(item.capacity),
  status: (item.status || (item.isActive === false ? 'maintenance' : 'available')) as TableStatus,
  location: item.location || 'Main Hall'
});

export function TableProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<RestaurantTable[]>([]);

  const refreshTables = async () => {
    try {
      const response = await tableService.getAllTables();
      if (response.data.success) {
        setTables(response.data.data.map(mapBackendTable));
      }
    } catch {
      setTables([]);
    }
  };

  useEffect(() => {
    void refreshTables();
  }, []);

  const addTable = async (data: Omit<RestaurantTable, 'id'>) => {
    try {
      const response = await tableService.createTable({
        tableNumber: String(data.number),
        capacity: data.capacity,
        location: data.location,
        status: data.status,
        isActive: data.status !== 'maintenance'
      });

      if (response.data.success) {
        await refreshTables();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateTable = async (id: string, data: Partial<RestaurantTable>) => {
    try {
      const response = await tableService.updateTable(id, {
        tableNumber: data.number !== undefined ? String(data.number) : undefined,
        capacity: data.capacity,
        location: data.location,
        status: data.status,
        isActive: data.status ? data.status !== 'maintenance' : undefined
      });

      if (response.data.success) {
        await refreshTables();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteTable = async (id: string) => {
    try {
      const response = await tableService.deleteTable(id);
      if (response.data.success) {
        await refreshTables();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const availableCount = tables.filter(t => t.status === 'available').length;

  return (
    <TableContext.Provider value={{ tables, addTable, updateTable, deleteTable, availableCount }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTables() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTables must be used within TableProvider');
  return ctx;
}

export type { TableStatus };
