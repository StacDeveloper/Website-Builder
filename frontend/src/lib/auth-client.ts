import { createAuthClient } from "better-auth/react"

const url = import.meta.env.VITE_BASE_URL as string || "http://localhost:3000"
export const authClient = createAuthClient({
    baseURL: url,
    fetchOptions: {
        credentials: "include"
    }
})
export const { signIn, signUp, useSession } = authClient