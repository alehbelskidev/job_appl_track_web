import * as z from "zod/v4"

const strongPassword = z.string()
	.min(8, { message: "Password must be at least 8 characters long" })
	.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
	.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
	.regex(/[0-9]/, { message: "Password must contain at least one number" })
	.regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })

export const loginSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
	password: z.string(),
})

export const registerSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
	password: strongPassword,
	confirmPassword: z.string(),
})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: "custom",
				message: "Passwords do not match",
				path: ["confirmPassword"],
			});
		}
	})

export const authResponseSchema = z.object({
	email: z.email(),
	tokens: z.object(({
		access_token: z.string(),
		refresh_token: z.string(),
	})),
})


export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type AuthResponseSchema = z.infer<typeof authResponseSchema>
