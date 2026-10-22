import { Activity } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function PatientExercisesPage() {
  return (
    <ComingSoon
      icon={Activity}
      eyebrow="Exercises"
      title="Your exercise plan"
      description="Exercises prescribed by your physiotherapist will appear here, with videos, repetitions and your progress."
    />
  );
}