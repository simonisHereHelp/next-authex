
/** @type {import("next").NextConfig} */
module.exports = {
  experimental: {
    serverActions: true,   // ← REQUIRED for NextAuth v5 helpers (auth/signIn/signOut/handlers)
  },
  output: "standalone",
}
