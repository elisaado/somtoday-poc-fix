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

import axios from "axios";
import { z } from "zod";

const orgParser = z.object({ uuid: z.string().uuid(), naam: z.string(), plaats: z.string() })
    .transform(org => { return { uuid: org.uuid, name: org.naam, location: org.plaats }; });

export async function getOrganizations(): Promise<Organization[]> {
    return axios.get("https://servers.somtoday.nl/organisaties.json")
        .then(r => r.data[0].instellingen.map((org: unknown) => {
            try {
                return orgParser.parse(org);
            } catch {
                return null;
            }
        }).filter((org: Organization | null) => org != null));
}

export async function findOrganization(query: string) {
    const queryLowerCase = query.toLowerCase();
    return getOrganizations().then(orgs => orgs.find(o => o.name.toLowerCase().includes(queryLowerCase)));
}

export type Organization = z.infer<typeof orgParser>