"use client"

import { signIn } from "next-auth/react"
import { AnimatedBackground } from "@/components/ui/AnimatedBackground"
import { Button } from "@/components/ui/Button"

export default function LoginPage() {
  const handleSignIn = async (provider: string) => {
    await signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground variant="home" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">
                Selamat Datang! 👋
              </h1>
              <p className="text-white/80 text-lg">
                Login untuk mulai bermain quiz
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => handleSignIn("google")}
                variant="primary"
                className="w-full text-lg py-4"
              >
                🔐 Login dengan Google
              </Button>

              <Button
                onClick={() => handleSignIn("github")}
                variant="secondary"
                className="w-full text-lg py-4"
              >
                🐙 Login dengan GitHub
              </Button>
            </div>

            <p className="text-white/60 text-sm text-center mt-6">
              Dengan login, kamu menyetujui syarat dan ketentuan kami
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
