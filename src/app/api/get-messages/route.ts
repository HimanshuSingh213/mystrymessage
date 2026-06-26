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

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" },
            { $sort: { "$messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ]);

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: user[0].messages
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