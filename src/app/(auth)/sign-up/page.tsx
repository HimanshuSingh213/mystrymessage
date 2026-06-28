"use client"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import Link from "next/link"
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/app/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, XCircle, CheckCircle2 } from 'lucide-react';

function Page() {
  const [username, setUsername] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);

  const router = useRouter();

  // zod implemention
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true)
        setUsernameMsg("")

        try {
          const res = await axios.get(`/api/check-username-uniqueness?username=${debouncedUsername}`);
          console.log("response for checking username uniqueness:", res)
          setUsernameMsg(res.data.message)
        } catch (err) {

          const axiosError = err as AxiosError<ApiResponse>
          setUsernameMsg(axiosError.response?.data.message ?? "Error checking Username")

        }
        finally {
          setIsCheckingUsername(false)
        }
      }
    }

    checkUsernameUnique()
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await axios.post<ApiResponse>("/api/sign-up", data)
      console.log("response for sign up:", res.data.message)

      router.replace(`/verify/${username}`)
    } catch (err) {
      console.error("Error in signup of user:", err)
      const axiosError = err as AxiosError<ApiResponse>
      let errorMsg = axiosError.response?.data.message ?? "Error signing up user"
      console.error("Axios error for error in sign up:", errorMsg)
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 antialiased selection:bg-zinc-800 selection:text-zinc-50">
      {/* Background soft glow effect for premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.8)_0%,rgba(9,9,11,1)_100%)] pointer-events-none" />

      <Card className="relative w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-zinc-700/80">
        <CardHeader className="space-y-1.5 pt-8 px-8 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-50">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            Enter your credentials to secure your workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300 font-medium">Username</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="username" 
                          className="bg-zinc-950/70 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 text-zinc-100 placeholder:text-zinc-600 pr-10 h-10 transition-colors"
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e)
                            setUsername(e.target.value)
                          }}
                        />
                      </FormControl>
                      
                      {/* Interactive inline loading state / verification feedback */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        {isCheckingUsername && (
                          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        )}
                        {!isCheckingUsername && usernameMsg && (
                          usernameMsg === "Username is available" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500" />
                          )
                        )}
                      </div>
                    </div>
                    
                    {!isCheckingUsername && usernameMsg && (
                      <p className={`text-xs font-medium tracking-wide mt-1 ${
                        usernameMsg === "Username is available" ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {usernameMsg}
                      </p>
                    )}
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300 font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        className="bg-zinc-950/70 border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700 text-zinc-100 placeholder:text-zinc-600 h-10 transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300 font-medium">Password</FormLabel>
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

              <Button 
                type="submit" 
                className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold h-10 shadow transition-all active:scale-[0.98]" 
                disabled={isSubmitting || isCheckingUsername}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>

            </form>
          </Form>
        </CardContent>

        <CardFooter className="pb-8 pt-2 px-8 flex justify-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-zinc-200 hover:text-zinc-50 font-medium underline underline-offset-4 ml-1 transition-colors">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
    </>
  )
}

export default Page