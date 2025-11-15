// src/app/api/auth/[...nextauth]/route.ts (CÓDIGO FINAL Y LISTO PARA PRODUCCIÓN)

import NextAuth from "next-auth";
// --- 1. NUEVAS IMPORTACIONES DE TIPOS ---
import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
// Renombramos nuestro 'User' para evitar conflictos con el 'User' por defecto de NextAuth
import { User as CustomUser } from '@/lib/users';

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { users } from '@/lib/users';

// --- 2. AÑADIMOS EL TIPO A NUESTRO OBJETO DE OPCIONES ---
export const authOptions: NextAuthOptions = {
    providers: [
        // ... (Tu sección de providers no cambia, está perfecta)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }
                const user = users.find(user => user.email === credentials.email);
                if (!user || !user.hashedPassword) {
                    throw new Error('Invalid credentials');
                }
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );
                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials');
                }
                // Hacemos un cast aquí para que coincida con nuestro CustomUser
                return user as any;
            }
        })
    ],

    callbacks: {
        // --- 3. AÑADIMOS LOS TIPOS A LOS PARÁMETROS DEL CALLBACK JWT ---
        async jwt({ token, user }: { token: JWT; user?: CustomUser | null }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                };
            }
            return token;
        },
        // --- 4. AÑADIMOS LOS TIPOS A LOS PARÁMETROS DEL CALLBACK SESSION ---
        async session({ session, token }: { session: Session; token: JWT }) {
            const newSession = { ...session };
            if (newSession.user) {
                newSession.user.name = token.name as string;
                (newSession.user as any).id = token.id as string;
            }
            return newSession;
        },
    },

    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };