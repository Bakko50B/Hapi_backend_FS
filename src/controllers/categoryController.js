import Category from '../models/Category.js';

const categoryController = {

  // GET ALL
  async getAll(request, h) {
    try {
      const categories = await Category.find();
      return h.response(categories).code(200);
    } catch (err) {
      return h.response({ error: 'Server error' }).code(500);
    }
  },

  // CREATE
  async create(request, h) {
    try {
      const { name, description } = request.payload;

      const normalizedName = name.trim().toLowerCase();

      const existing = await Category.findOne({ name: normalizedName });
      if (existing) {
        return h.response({ error: 'Kategorin finns redan' }).code(400);
      }

      const category = await Category.create({
        name: normalizedName,
        description
      });

      return h.response(category).code(201);

    } catch (err) {
      return h.response({ error: 'Server error' }).code(500);
    }
  },

  // GET ONE
  async getOne(request, h) {
    try {
      const category = await Category.findById(request.params.id);

      if (!category) {
        return h.response({ error: 'Kategori hittades inte' }).code(404);
      }

      return h.response(category).code(200);

    } catch (err) {
      return h.response({ error: 'Ogiltigt ID-format' }).code(400);
    }
  },

  // UPDATE
  async update(request, h) {
    try {
      const { name, description } = request.payload;

      const normalizedName = name?.trim().toLowerCase();

      const category = await Category.findById(request.params.id);
      if (!category) {
        return h.response({ error: 'Kategori hittades inte' }).code(404);
      }

      // Om namnet ändras → kontrollera duplicat
      if (normalizedName && normalizedName !== category.name) {
        const existing = await Category.findOne({ name: normalizedName });
        if (existing) {
          return h.response({ error: 'En kategori med detta namn finns redan' }).code(400);
        }
        category.name = normalizedName;
      }

      if (description) {
        category.description = description;
      }

      await category.save();

      return h.response(category).code(200);

    } catch (err) {
      return h.response({ error: 'Ogiltigt ID eller data' }).code(400);
    }
  },

  // DELETE
  async remove(request, h) {
    try {
      const category = await Category.findByIdAndDelete(request.params.id);

      if (!category) {
        return h.response({ error: 'Kategori hittades inte' }).code(404);
      }

      return h.response({ message: 'Kategori borttagen' }).code(200);

    } catch (err) {
      return h.response({ error: 'Ogiltigt ID-format' }).code(400);
    }
  }
};

export default categoryController;