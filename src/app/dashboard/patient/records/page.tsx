import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function PatientRecordsPage() {
  return (
    <ComingSoon
      icon={FileText}
      eyebrow="Records"
      title="Your medical records"
      description="Visit notes, diagnoses and scans from your physiotherapist will be kept here once your treatment begins."
    />
  );
}