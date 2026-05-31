import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendLeadNotification, sendCustomerConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body: Record<string, unknown> = await request.json();
    const supabase = await createServerSupabaseClient();

    // Map incoming fields to the leads table schema
    const leadData = {
      name: body.name || "Unknown",
      email: body.email || null,
      phone: body.phone || "",
      country: body.country || "International",
      form_type: body.form_type || "Inquiry Form",
      medical_condition: body.treatment || body.medical_condition || null,
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

    return NextResponse.json({ message: "Inquiry submitted successfully" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
