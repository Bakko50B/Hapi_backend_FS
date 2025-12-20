// import Product from "../models/Product.js"

import Product from "../models/Product.js"
import cloudinary from "../utils/cloudinary.js"

console.log("LOADED productController FROM:", import.meta.url)

const productController = {

  async getAll(req, reply) {
    reply.send("getAll not implemented yet")
  },

  async getOne(req, reply) {
    reply.send("getOne not implemented yet")
  },

  async create(req, reply) {
    try {
      const { name, price, categoryId, images } = req.body

      if (!name || !price || !categoryId) {
        return reply.code(400).send({ error: "Missing required fields" })
      }

      const imageArray = Array.isArray(images)
        ? images
        : images
          ? [images]
          : []

      const product = await Product.create({
        name,
        price: Number(price),
        categoryId: Number(categoryId),
        images: imageArray
      })

      reply.code(201).send(product)

    } catch (err) {
      console.error("Error in productController.create:", err)
      reply.code(500).send({ error: "Failed to create product" })
    }
  },

  async update(req, reply) {
    reply.send("update not implemented yet")
  },

  async remove(req, reply) {
    reply.send("remove not implemented yet")
  },

  // Ladda upp med bild i steg ett
  async createWithImage(req, reply) {
    try {
      // Hämta alla filer (stödjer 1–flera)
      const files = []
      if (req.isMultipart()) {
        for await (const file of req.files()) {
          files.push(file)
        }
      }

      if (files.length === 0) {
        return reply.code(400).send({ error: "No image file provided" })
      }

      // Hämta textdata från body
      const { name, description, price, stock, categoryId } = req.body

      if (!name || !price || !stock || !categoryId) {
        return reply.code(400).send({ error: "Missing product fields" })
      }

      // Ladda upp bilder till Cloudinary
      const uploadedUrls = []
      for (const file of files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => (error ? reject(error) : resolve(result))
          )
          file.file.pipe(uploadStream)
        })
        uploadedUrls.push(uploadResult.secure_url)
      }

      // Skapa produkten i databasen
      const product = await Product.create({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category: categoryId, // Mongoose ObjectId
        images: uploadedUrls
      })

      // Returnera produkten
      reply.code(201).send(product)

    } catch (err) {
      console.error("Error in createWithImage:", err)
      reply.code(500).send({ error: "Failed to create product with image" })
    }
  }
}
export default productController;
