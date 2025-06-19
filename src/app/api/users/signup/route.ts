import {db} from "@/db";
import {users} from "@/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {eq} from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const {email, username, password} = data;

        if(!email || !username || !password) {
            return NextResponse.json({error: "All fields are required"}, {status: 400});
        }

        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if(existingUser.length > 0) {
            return NextResponse.json({error: "User already exists"}, {status: 409});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.insert(users).values({
            email,
            username,
            password: hashedPassword,
        });

        return NextResponse.json({message: "User created successfully"}, {status: 201});
    }
    catch (error) {
        console.error("Error in signup route:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
