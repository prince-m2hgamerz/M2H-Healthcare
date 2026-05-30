import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await supabase.from("newsletter_subscribers").upsert(
      { email, subscribed_at: new Date().toISOString() },
      { onConflict: "email" }
    );
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
