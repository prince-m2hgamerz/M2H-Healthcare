import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM_EMAIL || "Asians Healthcare <noreply@asianshealthcare.com>";
const adminEmail = process.env.ADMIN_EMAIL || "admin@asianshealthcare.com";

export async function sendLeadNotification(lead: Record<string, unknown>) {
  const formType = lead.form_type as string;
  const name = lead.name as string;
  const country = lead.country as string;

  const fields = Object.entries(lead)
    .filter(([k]) => !["id", "status", "created_at", "updated_at"].includes(k))
    .map(([k, v]) => `<tr><td style="padding:8px 12px;border:1px solid #ddd;font-size:14px;text-transform:capitalize;color:#333">${k.replace(/_/g, " ")}</td><td style="padding:8px 12px;border:1px solid #ddd;font-size:14px;color:#111">${v || "-"}</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#000;padding:24px;text-align:center">
        <h1 style="color:#86efac;margin:0;font-size:20px">Asians Healthcare</h1>
      </div>
      <div style="padding:24px;background:#fbfbf5">
        <h2 style="margin:0 0 16px;font-size:18px;color:#111">New ${formType} Lead</h2>
        <table style="width:100%;border-collapse:collapse">
          ${fields}
        </table>
        <p style="margin-top:24px;font-size:13px;color:#666">This notification was sent automatically from Asians Healthcare.</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: adminEmail,
      subject: `New Lead: ${formType} from ${name} (${country})`,
      html,
    });
  } catch (err) {
    console.error("Failed to send email notification:", err);
  }
}
