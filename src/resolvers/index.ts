import bcrypt from 'bcryptjs';
import { users } from '../data/users';
import { signToken, requireRole } from '../utils/auth';
import {
  addEmployee,
  listEmployees,
  updateEmployee,
  setEmployeeFlag,
} from '../services/employeeService';
import { GraphQLContext } from '../context';

export const resolvers = {
  Query: {
    employees: (
      _: unknown,
      args: Parameters<typeof listEmployees>[0],
      ctx: GraphQLContext,
    ) => {
      if (!ctx.user) {
        throw new Error('Authentication required');
      }
      return listEmployees(args);
    },
    employee: async (_: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      if (!ctx.user) {
        throw new Error('Authentication required');
      }
      const employee = await ctx.loaders.employeeLoader.load(id);
      return employee ?? null;
    },
  },
  Mutation: {
    login: async (
      _: unknown,
      { email, password }: { email: string; password: string },
    ) => {
      const user = users.find((candidate) => candidate.email === email);
      if (!user) throw new Error('Invalid credentials');
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) throw new Error('Invalid credentials');
      const token = signToken({ sub: user.id, name: user.name, role: user.role });
      return {
        token,
        user: { id: user.id, name: user.name, role: user.role },
      };
    },
    addEmployee: async (
      _: unknown,
      { input }: { input: Parameters<typeof addEmployee>[0] },
      ctx: GraphQLContext,
    ) => {
      requireRole(ctx, ['admin']);
      return addEmployee(input);
    },
    updateEmployee: async (
      _: unknown,
      { id, input }: { id: string; input: Parameters<typeof updateEmployee>[1] },
      ctx: GraphQLContext,
    ) => {
      requireRole(ctx, ['admin']);
      return updateEmployee(id, input);
    },
    flagEmployee: async (
      _: unknown,
      { id, flagged }: { id: string; flagged: boolean },
      ctx: GraphQLContext,
    ) => {
      requireRole(ctx, ['admin', 'employee']);
      return setEmployeeFlag(id, flagged);
    },
  },
  Employee: {
    subjects: (parent: { subjects: string[] }) => parent.subjects,
    attendance: (parent: { attendance: number }) =>
      Number(parent.attendance.toFixed(1)),
  },
};

