import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const response = await axios
          .post("http://localhost:8000/login", {
            username: credentials?.username ?? "",
            password: credentials?.password ?? "",
          })
          .then(function (response) {
            console.log("response", response.data);
            return response.data;
          })
          .catch(function (error) {
            console.log("error", error);
            return error;
          });

        if (response) {
          // Any object returned will be saved in `user` property of the JWT
          return { ...response };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    signIn: async (user) => {
      // Return true to allow sign in
      // Return false to deny access
      return true;
    },
    redirect: async ({ url, baseUrl }) => {
      // If redirection after signIn is needed, you can use this callback
      return url.startsWith(baseUrl)
        ? Promise.resolve("/")
        : Promise.resolve(baseUrl);
    },
    jwt: async ({token, account, user}) => {
      console.log('token in jwt', token)
      console.log('user in jwt', user)
      if (user?.token) {
        token.accessToken = user.token;
      }
      return token;
    },
    session: ({session, user, token}) => {
      console.log('user in session', user)
      console.log('token in session', token)
      if (token?.accessToken){
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
