// app/[...proxy]/route.ts   (you can use .ts instead of .tsx)
import { auth } from "@/auth"
import { NextRequest } from "next/server"

function stripContentEncoding(result: Response) {
  const headers = new Headers(result.headers)
  headers.delete("content-encoding")
  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers,
  })
}

async function handler(request: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 })
  }

  const headers = new Headers(request.headers)
  headers.set("Authorization", `Bearer ${session.accessToken}`)

  const backendUrl =
    process.env.THIRD_PARTY_API_EXAMPLE_BACKEND ?? "https://third-party-backend.authjs.dev"

  const url = request.nextUrl.href.replace(request.nextUrl.origin, backendUrl)

  // Forward method/body only when present; NextRequest.body is a stream.
  const init: RequestInit = {
    method: request.method,
    headers,
    body: ["POST", "PUT", "PATCH"].includes(request.method) ? request.body : undefined,
  }

  const result = await fetch(url, init)
  return stripContentEncoding(result)
}

export const dynamic = "force-dynamic"
export { handler as GET, handler as POST }
