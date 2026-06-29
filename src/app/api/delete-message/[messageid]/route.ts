import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { User } from "next-auth";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ messageid: string }> }
) {
    const { messageid } = await params;
    await dbConnect();
    
    const session = await getServerSession(authOption);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { message: { _id: messageid } } }
        );

        if (updateResult.modifiedCount === 0) {
            return Response.json(
                { success: false, message: "Message not found or already deleted" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in delete message route:", error);
        return Response.json(
            { success: false, message: "Error deleting message" },
            { status: 500 }
        );
    }
}
