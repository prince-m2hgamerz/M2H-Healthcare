import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { subject, body } = await request.json();
    if (!subject || !body) {
      return Response.json({ error: "Subject and body are required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get subscribers from newsletter_subscribers table
    let emails: string[] = [];

    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email");

    if (subscribers && subscribers.length > 0) {
      emails = subscribers.map((s: { email: string }) => s.email);
    }

    // Also get Newsletter subscribers from leads table (fallback)
    const { data: leadSubscribers } = await supabase
      .from("leads")
      .select("email")
      .eq("form_type", "Newsletter")
      .not("email", "is", null);

    if (leadSubscribers && leadSubscribers.length > 0) {
      const leadEmails = leadSubscribers
        .map((s: { email: string | null }) => s.email)
        .filter((e): e is string => !!e);
      emails = [...new Set([...emails, ...leadEmails])];
    }

    if (emails.length === 0) {
      return Response.json({ error: "No subscribers found" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || "Asians Healthcare <noreply@asianshealthcare.com>";

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:0;background:#f5f5f5">
  <div style="background:#000;padding:24px;text-align:center">
    <h1 style="color:#86efac;margin:0;font-size:20px">Asians Healthcare</h1>
  </div>
  <div style="background:#ffffff;padding:32px 24px;border:1px solid #e0e0e0;border-top:none">
    <h2 style="margin:0 0 16px;font-size:22px;color:#111">${subject}</h2>
    <div style="font-size:15px;color:#333;line-height:1.7">
      ${body}
    </div>
  </div>
  <div style="padding:16px 24px;text-align:center">
    <p style="font-size:12px;color:#999;line-height:1.5;margin:0">
      Asians Healthcare | Delhi, India<br/>
      You received this because you subscribed to our newsletter.
    </p>
  </div>
</body>
</html>`;

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const email of emails) {
      try {
        const result = await resend.emails.send({ from, to: email, subject, html });
        if (result.error) {
          failed++;
          errors.push(`${email}: ${result.error.message}`);
        } else {
          sent++;
        }
      } catch (err) {
        failed++;
        errors.push(`${email}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const message = sent > 0
      ? `Successfully sent to ${sent} subscriber${sent !== 1 ? "s" : ""}${failed > 0 ? `. ${failed} failed.` : ""}`
      : `Failed to send. ${errors[0] || "Unknown error"}`;

    return Response.json({
      message,
      sent,
      failed,
      errors: errors.length > 0 ? errors : undefined,
      debug: {
        from,
        totalEmails: emails.length,
        apiKeySet: !!process.env.RESEND_API_KEY,
      },
    }, { status: sent > 0 ? 200 : 500 });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
