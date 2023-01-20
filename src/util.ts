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

import crypto from "crypto";

export function generateRandomString(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return [...Array(length)].map(() => characters[randomNumber(0, characters.length - 1)]).join("");
}

function randomNumber(min = 0, max: number) {
    return Math.floor(Math.random() * max) + min;
}

function base64URLEncode(buffer: Buffer) {
    return buffer
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

export function generateAuthVariables() {
    const verifier = base64URLEncode(crypto.randomBytes(32));
    const challenge = base64URLEncode(crypto.createHash("sha256").update(verifier).digest());
    return { verifier, challenge };
}