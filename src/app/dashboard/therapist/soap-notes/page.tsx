import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function TherapistSoapNotesPage() {
  return (
    <ComingSoon
      icon={FileText}
      eyebrow="SOAP notes"
      title="Visit notes"
      description="Write and review SOAP notes for your completed visits here."
    />
  );
}