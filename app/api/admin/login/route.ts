import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const validEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
    const validPass = process.env.ADMIN_PASSWORD || "admin123";

    if (email === validEmail && password === validPass) {
      const response = NextResponse.json({ success: true });

      response.cookies.set("admin_session", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
