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
        _id:{type: "text"}
      },
      async authorize(credentials) {
      

     
        return {
 
   
          email: credentials.email,
          role: credentials.role,
          _id: credentials._id
        };
      }
    })
  ],

callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.user = {
        email: user.email,
        role: user.role,
        _id: user._id,
      };
    }
    return token;
  },

  async session({ session, token }) {
    if (token.user) {
      session.user = token.user;
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