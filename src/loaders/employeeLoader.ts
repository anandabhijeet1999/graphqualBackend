import DataLoader from 'dataloader';
import { Employee } from '../types';
import { employees } from '../data/employees';

export const buildEmployeeLoader = () =>
  new DataLoader<string, Employee | undefined>(async (ids) => {
    const map = new Map(employees.map((emp) => [emp.id, emp]));
    return ids.map((id) => map.get(id));
  });

