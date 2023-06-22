import { SignJWT, jwtVerify } from 'jose'
import { AUTH_KEY } from '$env/static/private';
// make key openssl rand -hex 32
const AUTH_SECRET = new TextEncoder().encode(AUTH_KEY || "");

const verifyToken = async (token: string) => {
  return await jwtVerify(token, AUTH_SECRET).catch((e: any) => null)
};

const signToken = async (id: number, time = '1h') => {
  return new SignJWT({
    id: id
  })
		.setProtectedHeader({ alg: "HS256" })
    .setSubject(id.toString())
		.setIssuedAt()
		.setExpirationTime(time)
		.sign(AUTH_SECRET)
};

export {
  verifyToken,
  signToken
}