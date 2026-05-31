"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppFloat() {
  return (
    <motion.a
      href="https://api.whatsapp.com/send?phone=919650928250&text=Hello%2C+I+need+medical+assistance+for+treatment+in+India"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.4, type: "spring" }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white px-5 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={22} className="fill-white" />
      <span className="text-sm font-semibold hidden sm:inline group-hover:inline">Chat with Us</span>
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
    </motion.a>
  );
}
