import crypto from "crypto";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

type TokenPayload = AuthUser & {
  exp: number;
};

const tokenSecret = process.env.AUTH_SECRET || "team-task-manager-dev-secret";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, 64).toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(derived, "hex"),
  );
}

export function signToken(
  payload: AuthUser,
  expiresInSeconds = 60 * 60 * 24 * 7,
) {
  const tokenPayload: TokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString(
    "base64url",
  );
  const signature = crypto
    .createHmac("sha256", tokenSecret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): AuthUser | null {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", tokenSecret)
    .update(encodedPayload)
    .digest("base64url");

  if (expectedSignature !== signature) {
    return null;
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString("utf8"),
  ) as TokenPayload;

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };
}
