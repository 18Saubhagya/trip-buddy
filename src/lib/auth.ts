import {cookies} from "next/headers";
import { jwtVerify } from "jose";

const TOKEN_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET!);


export const getCurrentUserFromToken = async (req: Request) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const {payload} = await jwtVerify(token, TOKEN_SECRET);
        return payload as { id: number; email: string; username: string};
    } catch (error) {
        console.error("Error decoding token: ", error);
        return null;
    }
};
