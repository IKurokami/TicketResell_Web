import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.token = token;
      console.log("TESTss");
      console.log(`http://${process.env.NEXT_PUBLIC_API_URL}/api/authentication/login-google?accessToken=${session.accessToken}`);
      console.log("Session token:", token);
      await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}/api/authentication/login-google?accessToken=${session.accessToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      return session;
    },
  },
};

export default NextAuth(authOptions);