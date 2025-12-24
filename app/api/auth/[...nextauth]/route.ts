import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Login attempt started");

        if (!credentials?.username || !credentials?.password) {
          console.log("❌ Missing credentials");
          throw new Error("Please enter username and password");
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        console.log("📋 Environment check:");
        console.log("Username from env:", adminUsername);
        console.log("Password from env:", adminPassword);
        console.log("Provided username:", credentials.username);
        console.log("Provided password:", credentials.password);

        if (!adminUsername || !adminPassword) {
          console.log("❌ Environment variables not set");
          throw new Error("Server configuration error");
        }

        // Simple string comparison for testing
        if (credentials.username !== adminUsername) {
          console.log("❌ Username mismatch");
          throw new Error("Invalid username or password");
        }

        if (credentials.password !== adminPassword) {
          console.log("❌ Password mismatch");
          throw new Error("Invalid username or password");
        }

        console.log("✅ Authentication successful");

        return {
          id: "admin",
          name: adminUsername,
          email: `${adminUsername}@admin.com`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
