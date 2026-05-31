import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendLeadNotification, sendCustomerConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body: Record<string, unknown> = await request.json();
    const supabase = await createServerSupabaseClient();

    // Only insert known valid fields into the leads table
    const leadData: Record<string, unknown> = {
      name: body.name || "Unknown",
      email: body.email || null,
      phone: body.phone || "",
      country: body.country || "International",
      form_type: body.form_type || "Contact",
      medical_condition: body.medical_condition || body.treatment || null,
      message: body.message || null,
      status: "new",
    };

    const { data, error } = await supabase
      .from("leads")
      .insert([leadData] as never)
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

    return NextResponse.json({ message: "Lead created successfully" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
