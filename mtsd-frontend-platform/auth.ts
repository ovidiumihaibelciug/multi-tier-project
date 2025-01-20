import { JWT } from "./node_modules/@auth/core/jwt.d";
import NextAuth, { Session } from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { verifyPassword } from "@/utils/password";
import { getUserFromDb } from "./utils/db";
import console from "console";

export const { signIn, signOut, handlers, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          user = await getUserFromDb(email);

          console.log("user", user);

          if (!user) {
            throw new Error("User not found.");
          }

          const isPasswordValid = await verifyPassword(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            console.log("ERROR");

            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
      }
      return token;
    },
    session: ({ session, token }) => {
      console.log("token", token);
      session.user.id = token?.sub;
      session.user.type = token?.type;

      return session;
    },
  },
});
