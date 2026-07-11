export type TableStatus = 'available' | 'reserved' | 'maintenance';

export interface RestaurantTable {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  location: string;
}

export const mockTables: RestaurantTable[] = [
  { id: 't1', number: 1, capacity: 2, status: 'available', location: 'Window' },
  { id: 't2', number: 2, capacity: 2, status: 'available', location: 'Window' },
  { id: 't3', number: 3, capacity: 4, status: 'available', location: 'Main Hall' },
  { id: 't4', number: 4, capacity: 4, status: 'available', location: 'Main Hall' },
  { id: 't5', number: 5, capacity: 4, status: 'available', location: 'Patio' },
  { id: 't6', number: 6, capacity: 6, status: 'available', location: 'Main Hall' },
  { id: 't7', number: 7, capacity: 6, status: 'available', location: 'Private Room' },
  { id: 't8', number: 8, capacity: 8, status: 'maintenance', location: 'Private Room' },
];
