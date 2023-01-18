import axios, { AxiosResponse } from "axios";
import qs from "qs";
import { REDIRECT_URI, CLIENT_ID } from "./constants";
import { Organization } from "./organization";
import { parseToken } from "./types";
import { generateAuthVariables, generateRandomString } from "./util";

export default function huizengek(org: Organization, username: string, password: string) {
    return new Promise(res => {
        const client = axios.create({
            withCredentials: true
        });
        const cookies: Array<string> = [];
        const authVariables = generateAuthVariables();
        console.log(`authVariables: ${JSON.stringify(authVariables)}`);

        client.get("https://inloggen.somtoday.nl/oauth2/authorize", {
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
            maxRedirects: 0,
            validateStatus: s => s == 302
        }).then((response: AxiosResponse) => {
            if (response.headers["set-cookie"] == null || typeof response.headers.location !== "string") return res(false);
            cookies.push(...response.headers["set-cookie"].map(c => (c.split(";")[0])));

            const authToken = (new URL(response.headers.location)).searchParams.get("auth");
            if (typeof authToken !== "string") {
                res(false);
                return console.log("authToken niet gevonden (25huizengek1)\n");
            }
            console.log(`authToken gevonden: ${authToken}\n`);

            client.post("https://inloggen.somtoday.nl/", qs.stringify({
                loginLink: "x",
                "usernameFieldPanel:usernameFieldPanel_body:usernameField": username
            }), {
                params: {
                    "-1.-panel-signInForm": "",
                    auth: authToken
                },
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    origin: "https://inloggen.somtoday.nl",
                    cookie: cookies.join("; ")
                },
                maxRedirects: 0,
                validateStatus: s => s == 302
            }).then((response: AxiosResponse) => {
                if (response.headers["set-cookie"] == null) return res(false);
                cookies.push(...response.headers["set-cookie"].map(c => (c.split(";")[0])));

                client.post("https://inloggen.somtoday.nl/login", qs.stringify({
                    loginLink: "x",
                    "passwordFieldPanel:passwordFieldPanel_body:passwordField": password
                }), {
                    params: {
                        "1-1.-passwordForm": "",
                        auth: authToken
                    },
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        origin: "https://inloggen.somtoday.nl",
                        cookie: cookies.join("; ")
                    },
                    maxRedirects: 0,
                    validateStatus: s => s == 302
                }).then(async (response: AxiosResponse) => {
                    if (response.headers["set-cookie"] == null || typeof response.headers.location !== "string") return res(false);
                    cookies.push(...response.headers["set-cookie"].map(c => (c.split(";")[0])));

                    const authCode = (new URL(response.headers.location)).searchParams.get("code");
                    if (typeof authCode !== "string") {
                        res(false);
                        return console.log("authCode niet gevonden (25huizengek1)\n");
                    }
                    console.log(`authCode gevonden: ${authCode}\n`);

                    const json: unknown = (await client.post("https://inloggen.somtoday.nl/oauth2/token", qs.stringify({
                        grant_type: "authorization_code",
                        scope: "openid",
                        client_id: CLIENT_ID,
                        tenant_uuid: org.uuid,
                        session: "no_session",
                        code: authCode,
                        code_verifier: authVariables.verifier
                    }), {
                        headers: {
                            "content-type": "application/x-www-form-urlencoded",
                            cookie: cookies.join("; ")
                        }
                    })).data;

                    const token = parseToken(json);
                    if (token == null) {
                        res(false);
                        return console.log("token niet gevonden (25huizengek1)\n");
                    }
                    console.log(`token gevonden: ${JSON.stringify(token)}\n`);
                    
                    res(true);
                });
            });
        });
    });
}