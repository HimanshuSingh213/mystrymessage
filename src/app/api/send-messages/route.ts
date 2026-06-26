import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { Message } from "@/models/Users";

export async function POST(req: Request) {
    await dbConnect()

    const { username, content } = await req.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        //is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages"
                },
                { status: 403 }
            )
        }

        const newMessage = {content, createdAt: new Date()}
        user.message.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "message sent successfully"
            },
            { status: 404 }
        )
    } catch (err) {
        console.log("Error adding messages:",err)
        return Response.json(
            {
                success: false,
                message: "Error adding messages"
            },
            { status: 500 }
        )
    }
}