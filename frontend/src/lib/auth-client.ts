import { createAuthClient } from "better-auth/react"

const url = import.meta.env.VITE_BASE_URL! as string
export const authClient = createAuthClient({
    baseURL: url,
    fetchOptions: {
        credentials: "include"
    }
})
export const { signIn, signUp, useSession } = authClient