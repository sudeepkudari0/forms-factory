import * as z from "zod"

export const userLoginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
})

export const userSignUpSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().min(1),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  })
