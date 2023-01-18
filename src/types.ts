import { z } from "zod";

export const tokenParser = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    somtoday_api_url: z.string().url().nullable(),
    somtoday_oop_url: z.string().url().nullable(),
    scope: z.string(),
    somtoday_tenant: z.string(),
    id_token: z.string(),
    token_type: z.string(),
    expires_in: z.number()
});

export type Token = z.infer<typeof tokenParser>;

export function parseToken(json: unknown): Token | null {
    try {
        return tokenParser.parse(json);
    } catch {
        return null;
    }
}