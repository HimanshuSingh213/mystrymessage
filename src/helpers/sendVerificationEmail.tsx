import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const emailResponse = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Mystry message | Verification Code",
            react: <VerificationEmail username={username} otp={verifyCode} />
        });

        console.log("Resend API Response:", emailResponse);

        return { success: true, message: "Verification email sent successfully" }
    } catch (err) {
        console.error("Error sending verification email:", err)
        return { success: false, message: "Failed to send verification email" }
    }
}

