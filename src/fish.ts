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

import axios, { AxiosError } from "axios";
import qs from "qs";
import { REDIRECT_URI, CLIENT_ID } from "./constants";
import { Organization } from "./organization";
import { parseToken } from "./types";
import { generateAuthVariables, generateRandomString } from "./util";

export default function fish(org: Organization, username: string, password: string) {
    return new Promise(res => {
        const authVariables = generateAuthVariables();
        console.log(`authVariables: ${JSON.stringify(authVariables)}`);

        axios.get("https://inloggen.somtoday.nl/oauth2/authorize", {
            params: {
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                response_type: "code",
                state: generateRandomString(8),
                scope: "openid",
                tenant_uuid: org.uuid,
                session: "no_session",
                code_challenge: authVariables.challenge,
                code_challenge_method: "S256"
            },
            maxRedirects: 0
        }).then(() => res(false)).catch((err: AxiosError) => {
            if (typeof err.response?.headers?.location !== "string") return res(false);

            const authToken = (new URL(err.response.headers.location)).searchParams.get("auth");
            if (typeof authToken !== "string") {
                res(false);
                return console.log("authToken niet gevonden (Fish-o)\n");
            }
            console.log(`authToken gevonden: ${authToken}\n`);

            axios.post("https://inloggen.somtoday.nl/", qs.stringify({
                loginLink: "x",
                "usernameFieldPanel:usernameFieldPanel_body:usernameField": username,
                "passwordFieldPanel:passwordFieldPanel_body:passwordField": password
            }), {
                params: {
                    "-1.-panel-signInForm": "",
                    auth: authToken
                },
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    origin: "https://inloggen.somtoday.nl"
                },
                maxRedirects: 0
            }).catch(async (err: AxiosError) => {
                if (typeof err.response?.headers?.location !== "string") return res(false);

                const authCode = (new URL(err.response.headers.location)).searchParams.get("code");
                if (typeof authCode !== "string") {
                    res(false);
                    return console.log("authCode niet gevonden (Fish-o)\n");
                }
                console.log(`authCode gevonden: ${authCode}\n`);

                const json: unknown = (await axios.post("https://inloggen.somtoday.nl/oauth2/token", qs.stringify({
                    grant_type: "authorization_code",
                    code: authCode,
                    code_verifier: authVariables.verifier,
                    client_id: CLIENT_ID
                }), {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded"
                    }
                })).data;

                const token = parseToken(json);
                if (token == null) {
                    res(false);
                    return console.log("token niet gevonden (Fish-o)\n");
                }
                console.log(`token gevonden: ${JSON.stringify(token)}\n`);
                
                res(true);
            });
        });
    });
}