import crypto from "node:crypto";

function getKey(): Buffer {
  const envKey = process.env.ENCRYPTION_KEY;

  if (!envKey) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }

  if (envKey.length === 64 && /^[0-9a-fA-F]{64}$/.test(envKey)) {
    return Buffer.from(envKey, "hex");
  }

  if (envKey.length === 32) {
    return Buffer.from(envKey, "utf8");
  }

  return crypto.createHash("sha256").update(envKey).digest();
}

const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, ciphertext, authTag]).toString("base64");
}

export function decrypt(ciphertextBase64: string): string {
  const key = getKey();
  const data = Buffer.from(ciphertextBase64, "base64");

  if (data.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error("Invalid ciphertext");
  }

  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(-AUTH_TAG_LENGTH);
  const ciphertext = data.subarray(IV_LENGTH, -AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}
