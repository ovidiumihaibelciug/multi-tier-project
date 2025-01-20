import bcrypt from "bcryptjs";

/**
 * Salts and hashes a password.
 * @param password The plain text password.
 * @returns The hashed password.
 */
export async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Define the cost factor
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Verifies if a plain-text password matches the hashed password.
 * @param password The plain text password.
 * @param hash The hashed password from the database.
 * @returns True if the password matches, false otherwise.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
