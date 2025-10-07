import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
        jwt({ token, user }) {
            // Add user id to the token when user logs in
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            // Add user id to the session from token
            if (token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;