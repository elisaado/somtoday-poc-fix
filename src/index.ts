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

import { findOrganization } from "./organization";
import { schoolName, username, password } from "../config.json";
import fish from "./fish";
import huizengek from "./huizengek";

(async () => {
    console.log("----------------");
    console.log("  SOMtoday POC  ");
    console.log("----------------\n");
    console.log("Dit programma voert eerst de POC van @Fish-o uit, daarna die van @25huizengek1, om te kijken welke wel/niet werkt per school");

    console.log(`Organisatie ${schoolName} laden....`);
    const organization = await findOrganization(schoolName);
    if (typeof organization === "undefined") {
        return console.log("Geen organisatie gevonden, probeer een andere naam of fix je internet :)");
    }
    console.log(`Organisatie gevonden:\n${JSON.stringify(organization)}\n`);

    console.log("POC van Fish-o proberen...");
    const fishSuccess = await fish(organization, username, password);

    console.log("\nPOC van 25huizengek1 proberen....");
    const huizenSuccess = await huizengek(organization, username, password);

    console.log(`\nResultaten:\nFish-o: ${fishSuccess}\n25huizengek1: ${huizenSuccess}`);
})();