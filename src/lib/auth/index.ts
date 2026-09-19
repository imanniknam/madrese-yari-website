// Re-exports the root-level Auth.js config (auth.ts lives at the project root, which is
// where Auth.js v5 expects it) so the rest of the app can import via the stable "@/lib/auth"
// alias instead of a fragile chain of "../../.." relative paths.
export { handlers, auth, signIn, signOut } from "../../../auth";
