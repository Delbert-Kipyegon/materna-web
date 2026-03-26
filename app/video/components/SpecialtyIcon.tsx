import {
  User,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Smile,
} from "lucide-react";

export function SpecialtyIcon({ specialty }: { specialty: string }) {
  if (specialty.includes("Cardiologist") || specialty.includes("Heart"))
    return <Heart className="h-5 w-5 shrink-0 text-rose-400" />;
  if (
    specialty.includes("Mental Health") ||
    specialty.includes("Psychologist") ||
    specialty.includes("Psychiatrist")
  )
    return <Brain className="h-5 w-5 shrink-0 text-violet-400" />;
  if (specialty.includes("Eye") || specialty.includes("Ophthalmologist"))
    return <Eye className="h-5 w-5 shrink-0 text-sky-400" />;
  if (specialty.includes("General") || specialty.includes("Family"))
    return <Stethoscope className="h-5 w-5 shrink-0 text-emerald-400" />;
  if (specialty.includes("Pediatrician"))
    return <Smile className="h-5 w-5 shrink-0 text-amber-400" />;
  return <User className="h-5 w-5 shrink-0 text-zinc-500" />;
}
