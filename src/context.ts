import { decodeToken } from './utils/auth';
import { AuthContext } from './types';
import { buildEmployeeLoader } from './loaders/employeeLoader';

export interface GraphQLContext extends AuthContext {
  loaders: {
    employeeLoader: ReturnType<typeof buildEmployeeLoader>;
  };
}

export const buildContext = (req: { headers: Record<string, string | string[] | undefined> }): GraphQLContext => {
  const rawAuth = req.headers.authorization;
  const authHeader = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '').trim()
    : undefined;
  const decoded = decodeToken(token || '');
  const context: GraphQLContext = {
    loaders: {
      employeeLoader: buildEmployeeLoader(),
    },
  };

  if (decoded) {
    context.user = {
      id: decoded.sub,
      name: decoded.name,
      role: decoded.role,
    };
  }

  return context;
};

