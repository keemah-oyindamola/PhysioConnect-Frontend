import { ScrollText } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function AdminAuditLogsPage() {
  return (
    <ComingSoon
      icon={ScrollText}
      eyebrow="Audit logs"
      title="Activity history"
      description="A record of who did what and when, such as account changes and access to records."
    />
  );
}