import * as z from "zod"

export const userLoginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
})

export const userSignUpSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().min(1, {
      message: "Email is required",
    }),
    accessToken: z.string(),
    whatsapp: z.string().min(1, {
      message: "Whatsapp number is required",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  })
