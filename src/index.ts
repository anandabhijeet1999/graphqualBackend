import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { env } from './config/env';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { buildContext } from './context';

const bootstrap = async () => {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => buildContext(req as any),
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app as any, path: '/graphql', cors: false });

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `🚀 GraphQL ready at http://localhost:${env.port}${apolloServer.graphqlPath}`,
    );
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});

