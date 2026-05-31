import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendLeadNotification, sendCustomerConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body: Record<string, unknown> = await request.json();
    const supabase = await createServerSupabaseClient();

    // Build message combining treatment info and message
    const messageParts: string[] = [];
    if (body.treatment) messageParts.push(`Treatment: ${body.treatment}`);
    if (body.medical_condition) messageParts.push(`Condition: ${body.medical_condition}`);
    if (body.message) messageParts.push(String(body.message));
    const combinedMessage = messageParts.join("\n") || null;

    // Insert with known valid fields
    const leadData: Record<string, unknown> = {
      name: String(body.name || "Unknown"),
      email: body.email ? String(body.email) : null,
      phone: String(body.phone || ""),
      country: String(body.country || "International"),
      form_type: String(body.form_type || "Inquiry Form"),
      message: combinedMessage,
      status: "new",
    };

    // Try inserting with medical_condition
    let result = await supabase
      .from("leads")
      .insert([{ ...leadData, medical_condition: body.medical_condition || body.treatment || null }] as never)
      .select()
      .single();

    // Fallback: try without medical_condition column
    if (result.error) {
      result = await supabase
        .from("leads")
        .insert([leadData] as never)
        .select()
        .single();
    }

    // Final fallback: minimal fields
    if (result.error) {
      result = await supabase
        .from("leads")
        .insert([{
          name: leadData.name,
          phone: leadData.phone,
          country: leadData.country,
          form_type: leadData.form_type,
          message: combinedMessage,
          status: "new",
        }] as never)
        .select()
        .single();
    }

    if (result.error) {
      console.error("Supabase insert error:", result.error);
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    const lead = result.data as Record<string, unknown>;

    Promise.allSettled([
      sendLeadNotification(lead),
      sendCustomerConfirmation(lead),
    ]).catch(() => {});

    return NextResponse.json({ message: "Inquiry submitted successfully" }, { status: 201 });
  } catch (err) {
    console.error("API /api/inquiries error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
