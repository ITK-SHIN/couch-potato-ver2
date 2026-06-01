import {
  Calendar,
  Film,
  Smartphone,
  Users,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey } from "../types/siteContent";

const iconMap: Record<ServiceIconKey, LucideIcon> = {
  film: Film,
  calendar: Calendar,
  smartphone: Smartphone,
  users: Users,
  youtube: Youtube,
};

export function getServiceIcon(key: ServiceIconKey): LucideIcon {
  return iconMap[key] ?? Film;
}

export const serviceIconOptions: { value: ServiceIconKey; label: string }[] = [
  { value: "film", label: "필름" },
  { value: "calendar", label: "캘린더" },
  { value: "smartphone", label: "스마트폰" },
  { value: "users", label: "사람" },
  { value: "youtube", label: "유튜브" },
];
