/*
    SOMtoday POC - Dit programma voert eerst de POC van @Fish-o uit, daarna die van @25huizengek1 (GitHub), om te kijken welke wel/niet werkt per school
    Copyright (C) 2022  25huizengek1

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
}).transform(t => ({
    accessToken: t.access_token,
    refreshToken: t.refresh_token,
    apiURL: t.somtoday_api_url,
    oopURL: t.somtoday_oop_url,
    scope: t.scope,
    tenant: t.somtoday_tenant,
    idToken: t.id_token,
    type: t.token_type,
    expiresIn: t.expires_in
}));

export type Token = z.infer<typeof tokenParser>;

export function parseToken(json: unknown): Token | null {
    try {
        return tokenParser.parse(json);
    } catch {
        return null;
    }
}