import z from "zod";

export const usernameValidation = z
.string()
.min(8, "Username must be atleast 8 characters")
.max(20, "Username must be at most 20 characters")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")
.regex(/[a-zA-Z]/, "Username must contain at least one letter");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "password must contain atleast 8 characters"})
})