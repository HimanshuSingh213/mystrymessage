"use client"
import { verifySchema } from '@/app/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import z from "zod"
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useState } from 'react'

export default function VerifyPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")

    const router = useRouter()
    const { username } = useParams<{ username: string }>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        setSubmitError("")

        try {
            const res = await axios.post(`/api/verify-code`, {
                username,
                code: data.code
            });
            console.log("response for verifying user:", res.data.message)

            router.replace("/sign-in")
        } catch (err) {
            console.error("Error in verifying user:", err)
            const axiosError = err as AxiosError<ApiResponse>
            const errorMsg = axiosError.response?.data.message ?? "Error verifying code"
            console.error(errorMsg)
            setSubmitError(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 antialiased selection:bg-zinc-800 selection:text-zinc-50">
            {/* Background ambient lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.8)_0%,rgba(9,9,11,1)_100%)] pointer-events-none" />

            <Card className="relative w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-2xl transition-all duration-300">
                <CardHeader className="space-y-2 pt-8 px-8 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-zinc-50">
                        Verify Account
                    </CardTitle>
                    <CardDescription className="text-sm text-zinc-400">
                        We sent a verification code to your email. Enter it below to activate your account.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8 pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="000000"
                                                className="bg-zinc-950/70 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 text-zinc-100 placeholder:text-zinc-700 h-14 text-center text-2xl tracking-[0.5em] font-mono transition-colors"
                                                maxLength={6}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-rose-400 text-xs text-center" />
                                    </FormItem>
                                )}
                            />

                            {/* Global Submit Error Feedback */}
                            {submitError && (
                                <div className="rounded-md bg-rose-500/10 p-3 text-center text-sm text-rose-400 border border-rose-500/20">
                                    {submitError}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold h-11 shadow transition-all active:scale-[0.98]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Verifying...
                                    </span>
                                ) : (
                                    "Confirm Verification"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
