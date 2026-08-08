import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/923187300630"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 ring-1 ring-white/20 transition-transform hover:scale-110 active:scale-95"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" aria-hidden />
      <MessageCircle className="relative size-7" strokeWidth={2.2} />
    </a>
  );
}

export default WhatsAppButton;
