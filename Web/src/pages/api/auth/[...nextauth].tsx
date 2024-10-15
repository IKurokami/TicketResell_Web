import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    jwt: true,
  },
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
      console.log("Session token:", token);

      await fetch(
        `http://localhost:5296/api/authentication/login-google?accessToken=${session.accessToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials (cookies)
        }
      );

      return session;
    },
  },
};

export default NextAuth(authOptions);
