const app = require('./app');
const config = require('./config');
const { initDB, pool } = require('./db');

async function start() {
  try {
    await initDB();
    const server = app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${config.port}`);
    });

    const gracefulShutdown = async () => {
      // eslint-disable-next-line no-console
      console.log('Shutting down server...');
      server.close(async () => {
        await pool.end();
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
