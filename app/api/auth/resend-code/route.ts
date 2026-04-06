import { NextRequest, NextResponse } from 'next/server';
import { createVerificationCode } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user) {
            // Don't reveal whether user exists
            return NextResponse.json(
                { message: 'If an account exists, a new code has been sent.' },
                { status: 200 }
            );
        }

        if (user.emailVerified) {
            return NextResponse.json(
                { error: 'Email is already verified' },
                { status: 400 }
            );
        }

        // Generate and send new code
        try {
            const code = await createVerificationCode(normalizedEmail);
            await sendVerificationEmail(normalizedEmail, code);
        } catch (error: unknown) {
            if (error instanceof Error && error.message === 'RATE_LIMITED') {
                return NextResponse.json(
                    { error: 'Too many requests. Please wait before requesting a new code.' },
                    { status: 429 }
                );
            }
            throw error;
        }

        return NextResponse.json(
            { message: 'A new verification code has been sent to your email.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Resend code error:', error);
        return NextResponse.json(
            { error: 'An error occurred while sending the code' },
            { status: 500 }
        );
    }
}
