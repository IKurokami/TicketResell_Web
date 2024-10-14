import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import Cookies from "js-cookie";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      console.log("JWT token:", token);
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;

      var response = await fetch(
        `http://localhost:5296/api/authentication/login-google?accessToken=${session.accessToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials (cookies)
        }
      );

      if (response.ok) {
        // If the response is successful, read the response body if needed
        const data = await response.json();

        // Check the headers for Set-Cookie
        const cookie = response.headers.get("Set-Cookie");

        // If you're looking for a specific cookie, you can parse it
        if (cookie) {
          const sessionCookie = cookie
            .split(";")
            .find((c) => c.trim().startsWith(".AspNetCore.Session="));
          if (sessionCookie) {
            const cookieValue = sessionCookie.split("=")[1];
            Cookies.set(".AspNetCore.Session", cookieValue, { expires: 1 });
            console.log("Session cookie set:", cookieValue);
          }
        }

        console.log("Response data:", data);
      } else {
        console.error("Error:", response.statusText);
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
