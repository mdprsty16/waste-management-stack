import { SignJWT, jwtVerify } from 'jose';

// Ambil secret dari .env, fallback ke string statis jika belum diset
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }
  return secret;
};

export async function signToken(payload: any) {
  const secret = new TextEncoder().encode(getJwtSecretKey());
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Berlaku 1 hari
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}