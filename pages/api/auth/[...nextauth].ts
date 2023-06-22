import NextAuth, { NextAuthOptions } from "next-auth"
import type { OAuthConfig } from "next-auth/providers"

/**
 * Data contained in ID token returned by Authgarten OIDC provider.
 * https://github.com/creatorsgarten/creatorsgarten.org/blob/main/src/backend/auth/mintIdToken.ts
 */
export interface AuthgartenOidcClaims {
  /** Unique user ID (24 characters hexadecimal) */
  sub: string

  /** Full name */
  name: string

  /** Avatar URL */
  picture: string

  /** Connections */
  connections: {
    github?: {
      /** GitHub user ID */
      id: number
      /** Username */
      username: string
    }
    eventpop: {
      /** Eventpop user ID */
      id: number
    }
  }
}

const creatorsgartenProvider = {
  type: "oauth",
  id: "creatorsgarten",
  name: "Creatorsgarten",
  issuer: "https://creatorsgarten.org",
  wellKnown: "https://creatorsgarten.org/.well-known/openid-configuration",
  authorization: { params: { response_type: "id_token" } },

  // Add your Client ID to this URL to integrate with Authgarten:
  // https://github.com/creatorsgarten/creatorsgarten.org/blob/main/src/constants/oauth.ts
  clientId: "https://github.com/dtinth/authgarten-example",

  idToken: true,
  profile: (profile) => {
    return {
      id: profile.sub,
      name: profile.name,
      image: profile.picture,
    }
  },
} satisfies OAuthConfig<AuthgartenOidcClaims>

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [creatorsgartenProvider],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
}

export default NextAuth(authOptions)
