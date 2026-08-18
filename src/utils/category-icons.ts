import {
  BookOpen,
  Landmark,
  Globe,
  Map,
  BookText,
  Trophy,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  agama: BookOpen,
  sejarah: Landmark,
  umum: Globe,
  geografi: Map,
  "bahasa-sastra": BookText,
  olahraga: Trophy,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? HelpCircle;
}
