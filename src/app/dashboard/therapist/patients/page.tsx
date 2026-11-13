import { Users } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function TherapistPatientsPage() {
  return (
    <ComingSoon
      icon={Users}
      eyebrow="Patients"
      title="Your patients"
      description="Patients you've treated, with their visit history and progress, will appear here."
    />
  );
}