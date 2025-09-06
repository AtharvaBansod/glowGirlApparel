import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface TokenData {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

/**
 * Extracts and decodes user data from a JWT in a request cookie.
 * @param {NextRequest} request The incoming Next.js API request.
 * @returns {TokenData} The decoded user data from the token.
 * @throws {Error} If the token is missing, invalid, or expired.
 */
export const getTokenData = (request: NextRequest): TokenData => {
    try {
        // 1. Retrieve the token string from the 'token' cookie
        const token = request.cookies.get("token")?.value || "";

        if (!token) {
            throw new Error("Authentication token not found.");
        }

        // 2. Verify the token with the secret key and decode its payload
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

        // 3. Return the decoded data, cast to our expected type
        return decodedToken as TokenData;

    } catch (error: any) {
        // This will catch missing tokens, invalid signatures, expired tokens, etc.
        throw new Error("Invalid or expired authentication token.");
    }
};