import http from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import env from './src/config/env.js';
import { initSocket } from './src/config/socket.js';

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const PORT = env.PORT;

async function startServer() {
  try {
    // Attempt to connect to MongoDB but don't crash if it fails
    await connectDB().catch(err => {
      console.error('⚠️ Database connection failed (Proceeding in offline mode):', err.message);
    });

    // Always start listening
    server.listen(PORT, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Critical startup error:', error.message);
  }
}


// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

startServer();


