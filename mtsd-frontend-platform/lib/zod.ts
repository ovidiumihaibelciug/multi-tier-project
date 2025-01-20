import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Password is required" }),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required"
  ),
});
