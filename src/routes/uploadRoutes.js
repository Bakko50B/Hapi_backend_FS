import uploadController from '../controllers/uploadController.js';

const uploadRoutes = [
  {
    method: 'POST',
    path: '/media/upload',
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024
      },
      handler: uploadController.uploadImage
    }
  }
];

export default uploadRoutes;