import bcrypt from 'bcryptjs';

/**
 * Password validation result interface
 */
export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    checks: {
        minLength: boolean;
        hasUppercase: boolean;
        hasSpecialChar: boolean;
    };
}

/**
 * Validates password against requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 special character
 */
export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

    if (!minLength) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!hasUppercase) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: minLength && hasUppercase && hasSpecialChar,
        errors,
        checks: {
            minLength,
            hasUppercase,
            hasSpecialChar,
        },
    };
}

/**
 * Calculate password strength (weak, medium, strong)
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}
