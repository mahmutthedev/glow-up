"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="px-4 py-2 bg-gray-200 rounded">Loading...</div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-white">Welcome, {session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Sign in with Google
    </button>
  )
}