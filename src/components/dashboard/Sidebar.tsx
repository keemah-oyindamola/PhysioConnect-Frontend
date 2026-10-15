"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import {
  LayoutGrid,
  Calendar,
  Activity,
  FileText,
  Users,
  UserPlus,
  Building2,
  ScrollText,
  Settings,
} from "lucide-react";
import { Wordmark } from "@/components/common/Logo";

type NavItem = { icon: typeof LayoutGrid; label: string; href: string };

const navByRole: Record<string, NavItem[]> = {
  patient: [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard/patient" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/patient/appointments" },
    { icon: Activity, label: "Exercises", href: "/dashboard/patient/exercises" },
    { icon: FileText, label: "Records", href: "/dashboard/patient/records" },
    { icon: Settings, label: "Settings", href: "/dashboard/patient/settings" },
  ],
  therapist: [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard/therapist" },
    { icon: Users, label: "Patients", href: "/dashboard/therapist/patients" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/therapist/appointments" },
    { icon: FileText, label: "SOAP Notes", href: "/dashboard/therapist/soap-notes" },
    { icon: Settings, label: "Settings", href: "/dashboard/therapist/settings" }
  ],
  receptionist: [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard/receptionist" },
    { icon: UserPlus, label: "Register Patient", href: "/dashboard/receptionist/register" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/receptionist/appointments" },
    { icon: Settings, label: "Settings", href: "/dashboard/receptionist/settings" },

  ],
  admin: [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard/admin" },
    { icon: Users, label: "Staff", href: "/dashboard/admin/staff" },
    { icon: Building2, label: "Departments", href: "/dashboard/admin/departments" },
    { icon: ScrollText, label: "Audit Logs", href: "/dashboard/admin/audit-logs" },
    { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" },
  ],
};

function NavLinks({ role, onNavigate }: { role: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = navByRole[role] ?? [];

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${isActive ? "bg-teal text-white font-medium" : "text-ink/70 hover:bg-ink/5"
              }`}
          >
            <Icon size={17} strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({
  role,
  isOpen,
  onClose,
}: {
  role: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Desktop sidebar — always visible at md and up */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-ink/8 bg-paper px-4 py-6">
        <div className="px-2 mb-8">
          <Wordmark />
        </div>
        <NavLinks role={role} />
      </aside>

      {/* Mobile drawer — backdrop + slide-in panel, only rendered below md */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-ink/40 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-72 z-50 bg-paper px-4 py-6 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <Wordmark />
          <button onClick={onClose} aria-label="Close menu" className="text-ink/50">
            <X size={20} />
          </button>
        </div>
        <NavLinks role={role} onNavigate={onClose} />
      </aside>
    </>
  );
}