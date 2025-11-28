import { randomUUID } from 'crypto';
import {
  Employee,
  EmployeeConnection,
  EmployeeFilter,
  PaginationInput,
  SortInput,
} from '../types';
import { employees } from '../data/employees';
import { MemoryCache } from '../utils/cache';

export interface EmployeeInput
  extends Omit<Employee, 'id' | 'flagged'> {
  flagged?: boolean;
}

const listCache = new MemoryCache<EmployeeConnection>(3_000);

const DEFAULT_PAGINATION: PaginationInput = { page: 1, pageSize: 10 };
const DEFAULT_SORT: SortInput = { field: 'NAME', direction: 'ASC' };

const sorters: Record<SortInput['field'], (a: Employee, b: Employee) => number> = {
  NAME: (a, b) => a.name.localeCompare(b.name),
  AGE: (a, b) => a.age - b.age,
  ATTENDANCE: (a, b) => a.attendance - b.attendance,
  CLASS: (a, b) => a.className.localeCompare(b.className),
};

const normalize = (value: string) => value.toLowerCase();

const applyFilter = (data: Employee[], filter?: EmployeeFilter) => {
  if (!filter) return data;
  return data.filter((emp) => {
    if (filter.search) {
      const haystack = [emp.name, emp.className, emp.department, emp.location].join(' ');
      if (!normalize(haystack).includes(normalize(filter.search))) return false;
    }
    if (filter.className && emp.className !== filter.className) return false;
    if (filter.subject && !emp.subjects.some((subject) => subject === filter.subject)) return false;
    if (
      typeof filter.attendanceMin === 'number' &&
      emp.attendance < filter.attendanceMin
    )
      return false;
    if (
      typeof filter.attendanceMax === 'number' &&
      emp.attendance > filter.attendanceMax
    )
      return false;
    if (typeof filter.flagged === 'boolean' && emp.flagged !== filter.flagged) return false;
    return true;
  });
};

export const listEmployees = ({
  filter,
  pagination = DEFAULT_PAGINATION,
  sort = DEFAULT_SORT,
}: {
  filter?: EmployeeFilter;
  pagination?: PaginationInput;
  sort?: SortInput;
}): EmployeeConnection => {
  const key = JSON.stringify({ filter, pagination, sort });
  const cached = listCache.get(key);
  if (cached) return cached;

  const filtered = applyFilter(employees, filter);
  const comparator = sorters[sort.field];
  const direction = sort.direction === 'ASC' ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => comparator(a, b) * direction);

  const page = Math.max(1, pagination.page);
  const pageSize = Math.max(1, Math.min(25, pagination.pageSize));
  const start = (page - 1) * pageSize;
  const nodes = sorted.slice(start, start + pageSize);
  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const payload: EmployeeConnection = {
    nodes,
    pageInfo: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };

  listCache.set(key, payload);
  return payload;
};

export const getEmployeeById = (id: string) => employees.find((emp) => emp.id === id);

export const addEmployee = (input: EmployeeInput): Employee => {
  const slug =
    randomUUID().split('-')[0]?.toUpperCase() ?? Date.now().toString(36).toUpperCase();
  const employee: Employee = {
    ...input,
    id: `EMP-${slug}`,
    flagged: Boolean(input.flagged),
  };
  employees.unshift(employee);
  listCache.clear();
  return employee;
};

export const updateEmployee = (id: string, input: Partial<EmployeeInput>): Employee => {
  const existing = getEmployeeById(id);
  if (!existing) {
    throw new Error('Employee not found');
  }
  Object.assign(existing, input);
  if (typeof input.flagged === 'boolean') {
    existing.flagged = input.flagged;
  }
  listCache.clear();
  return existing;
};

export const setEmployeeFlag = (id: string, flagged: boolean) => {
  const employee = getEmployeeById(id);
  if (!employee) throw new Error('Employee not found');
  employee.flagged = flagged;
  listCache.clear();
  return employee;
};

