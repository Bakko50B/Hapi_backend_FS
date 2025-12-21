import jwt from 'jsonwebtoken';

export default async function authGuard(request, h) {
  try {
    // ✅ 1. Hoppa över multipart (som du redan gör)
    if (request.mime && request.mime.includes('multipart')) {
      return h.continue;
    }

    let token = null;

    // ✅ 2. Försök läsa token från cookie
    if (request.state?.token) {
      token = request.state.token;
    }

    // ✅ 3. Om ingen cookie → försök läsa Authorization-header
    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // ✅ 4. Om fortfarande inget token → inte inloggad
    if (!token) {
      return h.response({ error: 'Not logged in' }).code(401).takeover();
    }

    // ✅ 5. Verifiera token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 6. Lägg decoded user på request
    request.user = decoded;

    return h.continue;

  } catch (err) {
    return h.response({ error: 'Invalid token' }).code(401).takeover();
  }
}