import { Wordmark } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="border-t border-ink/8">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Wordmark />
        <p className="text-[12px] text-ink/40">© 2026 PhysioConnect. All rights reserved.</p>
      </div>
    </footer>
  );
}