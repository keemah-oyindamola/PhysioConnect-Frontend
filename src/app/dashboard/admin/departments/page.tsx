import { Building2 } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function AdminDepartmentsPage() {
  return (
    <ComingSoon
      icon={Building2}
      eyebrow="Departments"
      title="Departments"
      description="Organise your clinic into departments and assign staff to them."
    />
  );
}