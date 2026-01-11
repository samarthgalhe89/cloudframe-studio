import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { comparePassword } from './password-validation';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
    providers: [
        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
        }),
        // Credentials Provider
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                // Find user by email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error('Invalid email or password');
                }

                // Verify password
                const isValidPassword = await comparePassword(
                    credentials.password,
                    user.password
                );

                if (!isValidPassword) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in',
        signOut: '/',
        error: '/sign-in',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    // Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email! },
                    });

                    if (!existingUser) {
                        // Create new user for Google OAuth
                        const createData: { email: string; name: string | null } = {
                            email: user.email!,
                            name: user.name ?? null,
                        };

                        await prisma.user.create({
                            data: createData as any,
                        });
                    }
                    return true;
                } catch (error) {
                    console.error('Error during Google sign in:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }

            // For Google OAuth, fetch the user ID from database
            if (account?.provider === 'google' && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
