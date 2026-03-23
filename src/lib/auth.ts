/**
 * Auth stub — admin routes check CRON_SECRET header directly.
 * Full NextAuth session support can be added later.
 */

export interface Session {
  user?: {
    role?: string;
    email?: string;
  };
}

export async function auth(): Promise<Session | null> {
  return null;
}
