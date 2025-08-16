import NextAuth from "next-auth"
import { CredentialsProvider } from "next-auth/providers/credentials"
import { CredentialsProviderType } from "next-auth/providers/credentials"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        // ...add more providers here
        CredentialsProider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that sends a request to the login endpoint and returns an object with id, username, and token or false on error
                const user = { id: '1', name: 'John Doe', email: 'john@example.com' }
                if (user) {
                    return user
                } else {
                    return null
                }
            }
        })
    ]
}
const handler = NextAuth(authOptions)