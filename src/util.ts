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