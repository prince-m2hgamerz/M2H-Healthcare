import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = process.env.M2H_PUBLIC_WHATSAPP_NUMBER || "919650928250";
const MESSAGE = "Hi! I'm interested in medical treatment in India. Can you help?";

export default function WhatsAppButton() {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-16 bg-ink text-on-primary text-micro rounded-pill px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat on WhatsApp
      </span>
    </a>
  );
}
