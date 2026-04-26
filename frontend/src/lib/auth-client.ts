import { createAuthClient } from "better-auth/react"

const url = "/api"
export const authClient = createAuthClient({
    baseURL: url,
    fetchOptions: {
        credentials: "include"
    }
})
export const { signIn, signUp, useSession } = authClient
console.log(url)