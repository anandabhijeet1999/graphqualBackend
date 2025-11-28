import bcrypt from 'bcryptjs';
import { UserAccount } from '../types';

const saltRounds = 10;

const createHash = (plain: string) => bcrypt.hashSync(plain, saltRounds);

export const users: UserAccount[] = [
  {
    id: 'USR-1',
    email: 'admin@avant-garde.dev',
    name: 'Nova Admin',
    role: 'admin',
    passwordHash: createHash('admin123'),
  },
  {
    id: 'USR-2',
    email: 'employee@avant-garde.dev',
    name: 'Echo Employee',
    role: 'employee',
    passwordHash: createHash('employee123'),
  },
];

