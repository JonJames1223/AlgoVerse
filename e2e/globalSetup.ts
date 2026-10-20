import { createServer } from 'vite';

/** An in-process server has reliable cleanup on Windows and never stops a user's dev server. */
export default async function setup() {
  const server = await createServer({
    server: { host: '127.0.0.1', port: 5174, strictPort: true, open: false },
    logLevel: 'error',
  });
  await server.listen();
  return async () => {
    await server.close();
  };
}
