import productsController from '../controllers/productsController.js';
import authGuard from '../plugins/authGuard.js';
const productsRoutes = [
  {
    method: 'GET',
    path: '/products',
    options: {
      auth: false,
      // pre: [authGuard],
      handler: productsController.getAll
    }
  },
  {
    method: 'GET',
    path: '/products/{id}',
    options: {
      pre: [authGuard],
      handler: productsController.getOne
    }
  },
  {
    method: 'POST',
    path: '/products',
    options: {
      pre: [authGuard],
      handler: productsController.create
    }
  },
  {
    method: 'POST',
    path: '/products/with-image',
    options: {
      pre: [authGuard],
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024
      },
      handler: productsController.createWithImage
    }
  },
  {
    method: 'PUT',
    path: '/products/{id}/images',
    options: {
      pre: [authGuard],
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024
      },
      handler: productsController.uploadImages
    }
  },
  {
    method: 'PUT',
    path: '/products/{id}',
    options: {
      pre: [authGuard],
      handler: productsController.update
    }
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    options: {
      pre: [authGuard],
      handler: productsController.remove
    }
  },
  {
    method: 'DELETE',
    path: '/products/{id}/images/{publicId}',
    handler: productsController.removeImage
  }
];

export default productsRoutes;