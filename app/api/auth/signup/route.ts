import { NextRequest, NextResponse } from 'next/server';
import { validatePassword, hashPassword } from '@/lib/password-validation';
import { prisma } from '@/lib/prisma';
import { createVerificationCode } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate password requirements
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                {
                    error: 'Password does not meet requirements',
                    details: passwordValidation.errors
                },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            // If user exists but is not verified, resend verification code
            if (!existingUser.emailVerified && existingUser.password) {
                try {
                    const code = await createVerificationCode(normalizedEmail);
                    await sendVerificationEmail(normalizedEmail, code);
                } catch (error: unknown) {
                    if (error instanceof Error && error.message === 'RATE_LIMITED') {
                        return NextResponse.json(
                            { error: 'Too many attempts. Please wait before trying again.' },
                            { status: 429 }
                        );
                    }
                }
                return NextResponse.json(
                    {
                        message: 'Verification code resent',
                        redirect: `/verify-email?email=${encodeURIComponent(normalizedEmail)}`,
                    },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                { error: 'Email already in use' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user (unverified)
        await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                name: name || null,
                emailVerified: false,
            },
        });

        // Generate OTP and send verification email
        const code = await createVerificationCode(normalizedEmail);
        await sendVerificationEmail(normalizedEmail, code);

        return NextResponse.json(
            {
                message: 'Account created. Please verify your email.',
                redirect: `/verify-email?email=${encodeURIComponent(normalizedEmail)}`,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'An error occurred during signup' },
            { status: 500 }
        );
    }
}

