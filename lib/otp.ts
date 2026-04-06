import crypto from 'crypto';
import { prisma } from './prisma';

const OTP_EXPIRY_MINUTES = 10;
const MAX_RESENDS_PER_HOUR = 3;

/**
 * Generate a cryptographically random 6-digit OTP
 */
export function generateOTP(): string {
    // Generate a random number between 100000 and 999999
    const buffer = crypto.randomBytes(4);
    const num = buffer.readUInt32BE(0);
    const otp = 100000 + (num % 900000);
    return otp.toString();
}

/**
 * Create a verification code for the given email.
 * Deletes any existing codes for the email first.
 */
export async function createVerificationCode(email: string): Promise<string> {
    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limiting — max resends per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCodes = await prisma.verificationCode.count({
        where: {
            email: normalizedEmail,
            createdAt: { gte: oneHourAgo },
        },
    });

    if (recentCodes >= MAX_RESENDS_PER_HOUR) {
        throw new Error('RATE_LIMITED');
    }

    // Delete existing codes for this email
    await prisma.verificationCode.deleteMany({
        where: { email: normalizedEmail },
    });

    // Generate new code
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save to database
    await prisma.verificationCode.create({
        data: {
            email: normalizedEmail,
            code,
            expiresAt,
        },
    });

    return code;
}

/**
 * Verify an OTP code for the given email.
 * Returns { valid: true } on success or { valid: false, error: string } on failure.
 */
export async function verifyCode(
    email: string,
    code: string
): Promise<{ valid: boolean; error?: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    const verificationCode = await prisma.verificationCode.findFirst({
        where: {
            email: normalizedEmail,
            code: code.trim(),
        },
    });

    if (!verificationCode) {
        return { valid: false, error: 'Invalid verification code' };
    }

    // Check expiry
    if (new Date() > verificationCode.expiresAt) {
        // Delete expired code
        await prisma.verificationCode.delete({
            where: { id: verificationCode.id },
        });
        return { valid: false, error: 'Code has expired. Please request a new one.' };
    }

    // Code is valid — delete it (one-time use)
    await prisma.verificationCode.delete({
        where: { id: verificationCode.id },
    });

    // Mark user as verified
    await prisma.user.update({
        where: { email: normalizedEmail },
        data: { emailVerified: true },
    });

    return { valid: true };
}
