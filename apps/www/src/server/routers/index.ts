import superjson from 'superjson';
import { createRouter } from '../create-router';
import { classRouter } from './classes';

export const appRouter = createRouter()
  .transformer(superjson)
  /**
   * Add a health check endpoint to be called with `/api/trpc/healthz`
   */
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .merge('class.', classRouter);

export type AppRouter = typeof appRouter;
