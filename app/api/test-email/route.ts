import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM_EMAIL || "Asians Healthcare <noreply@asianshealthcare.com>";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Check env vars
  results.has_api_key = !!process.env.RESEND_API_KEY;
  results.api_key_prefix = process.env.RESEND_API_KEY?.startsWith("re_") ? "valid" : "invalid";
  results.from_env = process.env.RESEND_FROM_EMAIL || "(not set, using fallback)";
  results.from_used = from;
  results.admin_email = process.env.ADMIN_EMAIL || "(not set)";

  // Try sending a test email
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: process.env.ADMIN_EMAIL || "admin@asianshealthcare.com",
      subject: "Test Email from Asians Healthcare",
      html: "<p>If you receive this, email sending is working correctly.</p>",
    });
    results.send_result = data;
    results.send_error = error;
    results.success = !error;
  } catch (err) {
    results.send_caught = String(err);
    results.success = false;
  }

  return Response.json(results);
}
