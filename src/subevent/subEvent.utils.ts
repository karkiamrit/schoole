import { randomBytes } from 'crypto';

interface RegistrationIdOptions {
  /** Length of the ID (default: 10) */
  length?: number;

  /** Include numbers (default: true) */
  includeNumbers?: boolean;
  /** Include uppercase letters (default: true) */
  includeUppercase?: boolean;
  /** Include lowercase letters (default: false) */
  includeLowercase?: boolean;
  /** Prefix for the ID (default: 'REG') */
  prefix?: string;
  /** Year prefix (default: current year) */
  includeYear?: boolean;
}

/**
 * Generates a random registration ID with customizable options
 */
export function generateRegistrationId(
  options: RegistrationIdOptions = {},
): string {
  const {
    length = 10,
    includeNumbers = true,
    includeUppercase = true,
    includeLowercase = false,
    prefix = 'REG',
    includeYear = true,
  } = options;

  let chars = '';
  if (includeNumbers) chars += '0123456789';
  if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';

  // Generate random bytes and map them to our character set
  const bytes = randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }

  // Build the final ID with prefix and year if needed
  const yearStr = includeYear ? `${new Date().getFullYear()}-` : '';
  return `${prefix}-${yearStr}${result}`;
}

/**
 * Validates if a string is a valid registration ID
 */
export function isValidRegistrationId(id: string): boolean {
  // Basic validation - can be expanded based on specific requirements
  const pattern = /^REG-\d{4}-[A-Z0-9]{10}$/;
  return pattern.test(id);
}

/**
 * Extracts the year from a registration ID
 * Returns null if the ID doesn't contain a valid year
 */
export function extractYearFromRegistrationId(id: string): number | null {
  const match = id.match(/^REG-(\d{4})-/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}
