import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";

console.log("LOADED productController FROM:", import.meta.url);

const productController = {

  async getAll(request, h) {
    try {
      const products = await Product.find().populate("category");
      return h.response(products).code(200);
    } catch (err) {
      console.error("Error in getAll:", err);
      return h.response({ error: "Server error" }).code(500);
    }
  },

  async getOne(request, h) {
    try {
      const product = await Product.findById(request.params.id).populate("category");

      if (!product) {
        return h.response({ error: "Product not found" }).code(404);
      }

      return h.response(product).code(200);
    } catch (err) {
      console.error("Error in getOne:", err);
      return h.response({ error: "Invalid ID format" }).code(400);
    }
  },

  async create(request, h) {
    try {
      const { name, price, category, images } = request.payload;

      if (!name || !price || !category) {
        return h.response({ error: "Missing required fields" }).code(400);
      }

      const imageArray = Array.isArray(images)
        ? images
        : images
          ? [images]
          : [];

      const product = await Product.create({
        name,
        price: Number(price),
        category: category,
        images: imageArray
      });

      return h.response(product).code(201);

    } catch (err) {
      console.error("Error in productController.create:", err);
      return h.response({ error: "Failed to create product" }).code(500);
    }
  },

  async update(request, h) {
    try {
      const { id } = request.params;
      const { name, description, price, stock, category } = request.payload;

      const product = await Product.findById(id);
      if (!product) {
        return h.response({ error: "Product not found" }).code(404);
      }

      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = Number(price);
      if (stock) product.stock = Number(stock);
      if (category) product.category = category;

      await product.save();

      return h.response(product).code(200);

    } catch (err) {
      console.error("Error in update:", err);
      return h.response({ error: "Failed to update product" }).code(500);
    }
  },

  async remove(request, h) {
    try {
      const { id } = request.params;

      const product = await Product.findById(id);
      if (!product) {
        return h.response({ error: "Product not found" }).code(404);
      }

      // ✅ Ta bort bilder från Cloudinary
      for (const url of product.images) {
        try {
          const publicId = url.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (err) {
          console.warn("Cloudinary delete failed:", err);
        }
      }

      await product.deleteOne();

      return h.response({ message: "Product deleted" }).code(200);

    } catch (err) {
      console.error("Error in remove:", err);
      return h.response({ error: "Failed to delete product" }).code(500);
    }
  },

  // ✅ Hapi-version av createWithImage
  async createWithImage(request, h) {
    try {
      const payload = request.payload;

      const { name, description, price, stock, category } = payload;

      if (!name || !price || !stock || !category) {
        return h.response({ error: "Missing product fields" }).code(400);
      }

      // ✅ Hapi: filer ligger direkt i payload
      let files = payload.images || payload.image;

      if (!files) {
        return h.response({ error: "No image file provided" }).code(400);
      }

      if (!Array.isArray(files)) {
        files = [files];
      }

      const uploadedUrls = [];

      for (const file of files) {
        const fileStream = file._data;

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          uploadStream.end(fileStream);
        });

        uploadedUrls.push(uploadResult.secure_url);
      }

      const product = await Product.create({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category: category,
        images: uploadedUrls
      });

      return h.response(product).code(201);

    } catch (err) {
      console.error("Error in createWithImage:", err);
      return h.response({ error: "Failed to create product with image" }).code(500);
    }
  },
  async uploadImages(request, h) {
    try {
      const { id } = request.params;
      const product = await Product.findById(id);

      if (!product) {
        return h.response({ error: "Product not found" }).code(404);
      }

      let files = request.payload.images || request.payload.image;

      if (!files) {
        return h.response({ error: "No image file provided" }).code(400);
      }

      if (!Array.isArray(files)) {
        files = [files];
      }

      const uploadedUrls = [];

      for (const file of files) {
        const fileStream = file._data;

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          uploadStream.end(fileStream);
        });

        uploadedUrls.push(uploadResult.secure_url);
      }

      // ✅ Lägg till nya bilder i arrayen
      product.images.push(...uploadedUrls);
      await product.save();

      return h.response(product).code(200);

    } catch (err) {
      console.error("Error in uploadImages:", err);
      return h.response({ error: "Failed to upload images" }).code(500);
    }
  }


};

export default productController;