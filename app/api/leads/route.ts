import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendLeadNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body: Record<string, unknown> = await request.json();
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("leads")
      .insert([{ ...body, status: "new" }] as never)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    sendLeadNotification(data as Record<string, unknown>);

    return NextResponse.json({ message: "Lead created successfully" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
