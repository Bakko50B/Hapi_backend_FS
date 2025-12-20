import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import Cookie from '@hapi/cookie';

// ✅ Importera ALLA routes här
import productsRoutes from './routes/productsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';


dotenv.config();

export const init = async () => {
  await connectDB();

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  // ✅ Registrera plugins
  await server.register([
    Inert,
    Vision,
    Cookie
  ]);

  // ✅ Definiera cookie för authGuard
  server.state('token', {
    isSecure: false,
    isHttpOnly: true,
    path: '/'
  });

  // ✅ Registrera ALLA routes här
  server.route(productsRoutes);
  server.route(uploadRoutes);
  server.route(authRoutes);
  server.route(categoryRoutes);

  await server.start();
  console.log(`✅ Hapi server running at: ${server.info.uri}`);
};