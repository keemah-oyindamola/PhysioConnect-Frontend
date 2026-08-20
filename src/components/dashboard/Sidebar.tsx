"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Calendar,
  Activity,
  FileText,
  Users,
  UserPlus,
  Building2,
  ScrollText,
} from "lucide-react";
import { Wordmark } from "@/components/common/Logo";

type NavItem = { icon: typeof LayoutGrid; label: string; href: string };

const navByRole: Record<string, NavItem[]> = {
  patient: [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard/patient" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/patient/appointments" },
    { icon: Activity, label: "Exercises", href: "/dashboard/patient/exercises" },
    { icon: FileText, label: "Records", href: "/dashboard/patient/records" },
  ],
  therapist: [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard/therapist" },
    { icon: Users, label: "Patients", href: "/dashboard/therapist/patients" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/therapist/appointments" },
    { icon: FileText, label: "SOAP Notes", href: "/dashboard/therapist/soap-notes" },
  ],
  receptionist: [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard/receptionist" },
    { icon: UserPlus, label: "Register Patient", href: "/dashboard/receptionist/register" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/receptionist/appointments" },
  ],
  admin: [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard/admin" },
    { icon: Users, label: "Staff", href: "/dashboard/admin/staff" },
    { icon: Building2, label: "Departments", href: "/dashboard/admin/departments" },
    { icon: ScrollText, label: "Audit Logs", href: "/dashboard/admin/audit-logs" },
  ],
};

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const items = navByRole[role] ?? [];

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-ink/8 bg-paper px-4 py-6">
      <div className="px-2 mb-8">
        <Wordmark />
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                isActive
                  ? "bg-teal text-white font-medium"
                  : "text-ink/70 hover:bg-ink/5"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}