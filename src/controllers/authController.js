import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authController = {

  // ✅ REGISTER
  async register(request, h) {
    try {
      const { username, password } = request.payload;

      if (!username || !password) {
        return h.response({ error: 'Username and password required' }).code(400);
      }

      const existing = await User.findOne({ username });
      if (existing) {
        return h.response({ error: 'User already exists' }).code(409);
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({ username, passwordHash });

      return h.response({
        message: 'User registered',
        user: { id: user._id, username: user.username }
      }).code(201);

    } catch (err) {
      return h.response({ error: 'Server error', details: err.message }).code(500);
    }
  },

  // ✅ LOGIN
  async login(request, h) {
    try {
      const { username, password } = request.payload;

      const user = await User.findOne({ username });
      if (!user) {
        return h.response({ error: 'Invalid credentials' }).code(401);
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return h.response({ error: 'Invalid credentials' }).code(401);
      }

      // ✅ Skapa JWT (Hapi har ingen inbyggd jwt-server som Fastify)
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // ✅ Sätt cookie (matchar din server.state('token'))
      h.state('token', token, {
        isHttpOnly: true,
        sameSite: 'Strict',
        path: '/',
        ttl: 3600 * 1000 // 1 timme i ms
      });

      return h.response({ message: 'Logged in' }).code(200);

    } catch (err) {
      console.error('LOGIN ERROR STACK:', err);
      return h.response({ error: 'Server error', details: err.message }).code(500);
    }
  },

  // ✅ LOGOUT
  async logout(request, h) {
    h.unstate('token');
    return h.response({ message: 'Logged out' }).code(200);
  }
};

export default authController;