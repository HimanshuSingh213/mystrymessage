import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";

export const POST = async (req: Request) => {
    await dbConnect()

    try {
        const { username, code } = await req.json();

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            },
                { status: 500 }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (!isCodeValid) {
            console.error("Verification code is incorrect")
            return Response.json({
                success: false,
                message: "Verification code is incorrect"
            },
                { status: 500 }
            )
        }

        if (!isCodeNotExpired) {
            console.error("Verification code expired, please try again.")
            return Response.json({
                success: false,
                message: "Verification code expired, please try again."
            },
                { status: 500 }
            )
        }

        user.isVerified = true
        await user.save()

        return Response.json({
            success: true,
            message: "Account verified successfully"
        },
            { status: 200 }
        )


    } catch (err) {
        console.error("Error verifying user", err)
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
            { status: 500 }
        )
    }
}