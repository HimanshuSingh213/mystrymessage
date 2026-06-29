import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect()

    const session = await getServerSession(authOption)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, { status: 404 })
        }

        const sortedMessages = [...foundUser.message].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return Response.json({
            success: true,
            message: sortedMessages
        }, { status: 200 })

    } catch (err) {
        console.log("An unexpected error occured:", err)
        return Response.json(
            {
                success: false,
                message: "An unexpected error occured"
            },
            { status: 500 }
        )
    }
}