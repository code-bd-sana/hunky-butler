import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET || 'aidfjnvociydfnovfadf',

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        role: { type: "text" },
        _id: { type: "text" }
      },
      async authorize(credentials) {
        // এখানে actual authentication logic যোগ করুন
        // যেমন database check, password verification etc.
        
        if (!credentials.email) {
          return null;
        }

        // Temporary - production-এ actual authentication implement করুন
        return {
          id: credentials._id,
          email: credentials.email,
          role: credentials.role,
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Step 1: User sign in করলে
      if (user) {
        token.role = user.role; // সরাসরি token-এ role রাখুন
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // Step 2: Token থেকে session-এ data send করুন
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role; // role সরাসরি session-এ
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login?error='
  },

  debug: process.env.NODE_ENV === 'development'
});

export { handler as GET, handler as POST };