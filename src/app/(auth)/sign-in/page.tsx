"use client"
import z from 'zod'
import { signInSchema } from '@/app/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier: data.username,
        password: data.password
      })

      if (res?.error) {
        setSubmitError(res.error)
      }
      else if (res?.url) {
        router.replace("/dashboard")
      }

    } catch (error) {
      console.error("Sign-in failed:", error)
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 antialiased selection:bg-zinc-800 selection:text-zinc-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.8)_0%,rgba(9,9,11,1)_100%)] pointer-events-none" />

      <Card className="relative w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-2xl transition-all duration-300">
        <CardHeader className="space-y-1.5 pt-8 px-8 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-50">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300 font-medium">Email or Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="bg-zinc-950/70 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-10 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-zinc-300 font-medium">Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-zinc-950/70 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-10 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Global Error State Display */}
              {submitError && (
                <div className="rounded-md bg-rose-500/10 p-3 text-center text-sm text-rose-400 border border-rose-500/20">
                  {submitError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold h-10 shadow transition-all active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

            </form>
          </Form>
        </CardContent>

        <CardFooter className="pb-8 pt-2 px-8 flex justify-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-zinc-200 hover:text-zinc-50 font-medium underline underline-offset-4 ml-1 transition-colors">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
