import categoryController from '../controllers/categoryController.js';
import authGuard from '../plugins/authGuard.js';

const categoryRoutes = [
  {
    method: 'GET',
    path: '/categories',
    handler: categoryController.getAll
  },
  {
    method: 'GET',
    path: '/categories/{id}',
    handler: categoryController.getOne
  },
  {
    method: 'POST',
    path: '/categories',
    options: {
      pre: [authGuard]
    },
    handler: categoryController.create
  },
  {
    method: 'PUT',
    path: '/categories/{id}',
    options: {
      pre: [authGuard]
    },
    handler: categoryController.update
  },
  {
    method: 'DELETE',
    path: '/categories/{id}',
    options: {
      pre: [authGuard]
    },
    handler: categoryController.remove
  }
];

export default categoryRoutes;