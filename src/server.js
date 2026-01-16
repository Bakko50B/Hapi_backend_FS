import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import Cookie from '@hapi/cookie';

// Importera ALLA routes 
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
        origin: ['*'],
        credentials: true

      }
    }
  });

  // Registrera plugins
  await server.register([
    Inert,
    Vision,
    Cookie
  ]);

  // Definiera cookie för authGuard
  server.state('token', {
    isSecure: false,
    isHttpOnly: true,
    path: '/'
  });

  // Registrera ALLA routes 
  server.route(productsRoutes);
  server.route(uploadRoutes);
  server.route(authRoutes);
  server.route(categoryRoutes);

// Testutskrift till konsollen
//   console.log(
//   server.table().some(r =>
//     r.method === 'put' &&
//     r.path === '/products/{id}/images'
//   )
//     ? "Route /products/{id}/images finns"
//     : "Route /products/{id}/images saknas"
// );



  await server.start();
  console.log(`Hapi server running at: ${server.info.uri}`);

  // console.log("Registered routes:");
  // console.log(server.table());

};