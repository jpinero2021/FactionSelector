import { createHash, randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const AUTH_FILE = path.join(process.cwd(), "admin_auth.enc");
const SECRET_KEY = "prismaverso88_admin_key_secure";

// Encrypt text using AES with IV (new format)
function encrypt(text: string): string {
  const iv = randomBytes(16);
  const key = createHash('sha256').update(SECRET_KEY).digest();
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt legacy format (no IV, emulates old createDecipher with aes192)
function decryptLegacy(encrypted: string): string {
  // Emulate the old createDecipher behavior by generating a key and IV from the password
  // This matches the deprecated createDecipher('aes192', password) behavior
  const hash = createHash('md5').update(SECRET_KEY).digest();
  const key = hash.subarray(0, 24); // AES192 key is 24 bytes
  const iv = Buffer.alloc(16, 0); // Legacy createDecipher used zero IV
  
  const decipher = createDecipheriv('aes-192-cbc', key, iv);
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Decrypt text - handles both new (with IV) and legacy formats (without IV)
function decrypt(encrypted: string): string {
  // Check if this is the new format (contains ':' separator for IV)
  if (encrypted.includes(':')) {
    // New format with IV
    const [ivHex, encryptedHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = createHash('sha256').update(SECRET_KEY).digest();
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } else {
    // Legacy format without IV
    return decryptLegacy(encrypted);
  }
}

// Initialize admin password file if it doesn't exist
export async function initializeAdminAuth(): Promise<void> {
  try {
    await fs.access(AUTH_FILE);
  } catch {
    // File doesn't exist, create it with the password
    const encryptedPassword = encrypt("rakion123");
    await fs.writeFile(AUTH_FILE, encryptedPassword, 'utf8');
  }
}

// Validate admin password
export async function validateAdminPassword(inputPassword: string): Promise<boolean> {
  try {
    await initializeAdminAuth();
    const encryptedPassword = await fs.readFile(AUTH_FILE, 'utf8');
    const storedPassword = decrypt(encryptedPassword);
    
    // Check if password matches
    const isValid = inputPassword === storedPassword;
    
    // If valid and using legacy format (no ':' delimiter), migrate to new format
    if (isValid && !encryptedPassword.includes(':')) {
      console.log('Migrating legacy password format to new format with IV');
      const newEncryptedPassword = encrypt(storedPassword);
      await fs.writeFile(AUTH_FILE, newEncryptedPassword, 'utf8');
    }
    
    return isValid;
  } catch (error) {
    console.error('Error validating admin password:', error);
    return false;
  }
}

// Generate session token for admin
export function generateAdminToken(): string {
  const timestamp = Date.now().toString();
  const random = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(timestamp + random + SECRET_KEY).digest('hex');
  return `admin_${hash.substring(0, 32)}`;
}

// Validate session token (simple validation, in production use proper JWT)
export function validateAdminToken(token: string): boolean {
  return token.startsWith('admin_') && token.length === 38;
}