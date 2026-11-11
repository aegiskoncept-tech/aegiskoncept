import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const cleanEmail = credentials.email.toLowerCase().trim();
        let user = null;

        try {
          user = await db.user.findUnique({
            where: { email: cleanEmail },
          });
        } catch (dbErr: any) {
          console.warn('[Auth] Database User query failed:', dbErr?.message);
        }

        // Emergency fallback if database tables do not exist yet or are unseeded
        if (!user) {
          if (cleanEmail === 'admin@aegiskoncept.com' && credentials.password === 'AegisAdmin2026!') {
            // Attempt to auto-create admin if possible, but let the user in
            try {
              user = await db.user.upsert({
                where: { email: cleanEmail },
                update: {},
                create: {
                  email: cleanEmail,
                  name: 'Ritesh Kumar',
                  passwordHash: await bcrypt.hash(credentials.password, 10),
                  role: 'ADMIN',
                },
              });
            } catch {}

            return {
              id: user?.id || 'admin-master',
              name: 'Ritesh Kumar',
              email: 'admin@aegiskoncept.com',
              role: 'ADMIN',
            };
          }
          throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isMatch) {
          console.warn(`[Auth] Password mismatch for user: ${cleanEmail}`);
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'aegis-koncept-super-secret-development-key-change-in-production',
};

