export type Role = 'admin' | 'employee';

export interface Employee {
  id: string;
  name: string;
  age: number;
  className: string;
  subjects: string[];
  attendance: number;
  title: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  bio: string;
  flagged: boolean;
  hireDate: string;
}

export interface EmployeeFilter {
  search?: string;
  className?: string;
  subject?: string;
  attendanceMin?: number;
  attendanceMax?: number;
  flagged?: boolean;
}

export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface SortInput {
  field: 'NAME' | 'AGE' | 'ATTENDANCE' | 'CLASS';
  direction: 'ASC' | 'DESC';
}

export interface PageInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EmployeeConnection {
  nodes: Employee[];
  pageInfo: PageInfo;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
}

export interface AuthContext {
  user?: Pick<UserAccount, 'id' | 'name' | 'role'> | undefined;
}

