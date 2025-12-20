import authController from '../controllers/authController.js';

const authRoutes = [
  {
    method: 'POST',
    path: '/auth/register',
    handler: authController.register
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: authController.login
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: authController.logout
  }
];

export default authRoutes;