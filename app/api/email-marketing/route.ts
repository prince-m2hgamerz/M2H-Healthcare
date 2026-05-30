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

    const { data: subscribers, error: dbError } = await supabase
      .from("newsletter_subscribers")
      .select("email");

    if (dbError || !subscribers?.length) {
      return Response.json({ error: dbError?.message || "No subscribers found" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || "Asians Healthcare <noreply@asianshealthcare.com>";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fbfbf5">
      <div style="background:#000;padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#86efac;margin:0;font-size:20px">Asians Healthcare</h1>
      </div>
      <div style="background:#fff;padding:32px 24px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px">
        ${body}
        <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0" />
        <p style="font-size:12px;color:#999;line-height:1.5">
          Asians Healthcare | Delhi, India<br />
          You received this email because you subscribed to our newsletter.
        </p>
      </div>
    </body></html>`;

    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      try {
        await resend.emails.send({ from, to: sub.email, subject, html });
        sent++;
      } catch {
        failed++;
      }
    }

    return Response.json({
      message: `Sent to ${sent} subscriber${sent !== 1 ? "s" : ""}${failed > 0 ? `. ${failed} failed.` : ""}`,
      sent,
      failed,
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
