import cloudinary from '../utils/cloudinary.js';

const uploadController = {
  async uploadImage(request, h) {
    try {
      //Hapi lägger filer i request.payload
      const file = request.payload?.file;

      if (!file || !file._data) {
        return h.response({ error: 'No file uploaded' }).code(400);
      }

      //Ladda upp till Cloudinary (motsvarar file.file.pipe(uploadStream))
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => (error ? reject(error) : resolve(result))
        );

        //Filens data ligger i file._data (Buffer)
        uploadStream.end(file._data);
      });

      return h.response({ url: result.secure_url }).code(200);

    } catch (err) {
      console.error('Upload failed:', err);
      return h.response({ error: 'Upload failed' }).code(500);
    }
  }
};

export default uploadController;