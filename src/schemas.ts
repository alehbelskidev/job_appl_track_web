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

export const applicationSchema = z.object({
	id: z.uuid(),
	company: z.string(),
	role: z.string(),
	date_applied: z.string(),
	date_updated: z.string().nullable(),
	status: z.number(),
	description: z.string().optional(),
	url: z.string().optional(),
	notes: z.string().optional(),
	owner_id: z.string().optional()
})


export const createApplicationSchema = z.object({
	company: z.string(),
	role: z.string(),
	description: z.string().optional(),
	url: z.httpUrl().optional(),
	notes: z.string().optional(),
})

export const updateApplicationSchema = z.object({
	status: z.number(),
})

export const applicationResponseSchema = z.object({
	data: applicationSchema,
})

export const applicationsResponseSchema = z.object({
	data: applicationSchema.array(),
})

export const deleteApplicationResponseSchema = z.object({
	data: z.boolean()
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type AuthResponseSchema = z.infer<typeof authResponseSchema>
export type ApplicationSchema = z.infer<typeof applicationSchema>
export type CreateApplicationSchema = z.infer<typeof createApplicationSchema>
export type UpdateApplicationSchema = z.infer<typeof updateApplicationSchema>
export type ApplicationResponseSchema = z.infer<typeof applicationResponseSchema>
export type ApplicationsResponseSchema = z.infer<typeof applicationsResponseSchema>
