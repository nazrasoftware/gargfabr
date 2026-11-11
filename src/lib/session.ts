// Signed admin session token, usable from both proxy and server code (Web Crypto only).
export const SESSION_COOKIE = "gf_admin";
export const SESSION_TTL_S = 60 * 60 * 24 * 7;

const enc = new TextEncoder();

function secret() {
  return process.env.SESSION_SECRET || "dev-only-change-me-garg-fabrication";
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  let bin = "";
  for (const b of new Uint8Array(sig)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_S;
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifyToken(token: string | undefined) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  const expected = await hmac(exp);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
