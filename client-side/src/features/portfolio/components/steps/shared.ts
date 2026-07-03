import {
  Ruler, Compass, Sofa, HardHat, Handshake, Briefcase,
  type LucideIcon,
} from "lucide-react";
import type { PortfolioFormData } from "@/lib/portfolio-api";

export interface StepProps {
  form: PortfolioFormData;
  update: (patch: Partial<PortfolioFormData>) => void;
  errors: Record<string, string>;
}

/** Resolve a CategoryMeta.icon string to its lucide component. */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Ruler,
  Compass,
  Sofa,
  HardHat,
  Handshake,
  Briefcase,
};
