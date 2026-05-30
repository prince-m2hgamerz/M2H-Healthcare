import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendLeadNotification, sendCustomerConfirmation } from "@/lib/email";

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

    const lead = data as Record<string, unknown>;

    await Promise.allSettled([
      sendLeadNotification(lead),
      sendCustomerConfirmation(lead),
    ]);

    return NextResponse.json({ message: "Inquiry submitted successfully", id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
