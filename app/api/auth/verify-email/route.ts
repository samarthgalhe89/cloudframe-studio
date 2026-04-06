import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/otp';

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and code are required' },
                { status: 400 }
            );
        }

        const result = await verifyCode(email, code);

        if (!result.valid) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Email verified successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify email error:', error);
        return NextResponse.json(
            { error: 'An error occurred during verification' },
            { status: 500 }
        );
    }
}
