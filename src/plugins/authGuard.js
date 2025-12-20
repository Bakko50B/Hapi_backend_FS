import jwt from 'jsonwebtoken';

export default async function authGuard(request, h) {
  try {
    // ✅ 1. Hoppa över multipart (samma logik som i Fastify)
    if (request.mime && request.mime.includes('multipart')) {
      return h.continue;
    }

    // ✅ 2. Hämta token från cookies (samma som req.cookies.token)
    const token = request.state?.token;

    if (!token) {
      return h.response({ error: 'Not logged in' }).code(401).takeover();
    }

    // ✅ 3. Verifiera token (samma som fastify.jwt.verify)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 4. Lägg decoded user på request (samma som req.user)
    request.user = decoded;

    return h.continue;

  } catch (err) {
    return h.response({ error: 'Invalid token' }).code(401).takeover();
  }
}