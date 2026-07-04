import { Ruler, Compass, Sofa, HardHat, Handshake, Briefcase, type LucideIcon } from "lucide-react";
import type { PortfolioCategory } from "@/lib/portfolio-schemas";

// Public-facing category presentation (label + icon), decoupled from the wizard.
export const CATEGORY_ICON: Record<PortfolioCategory, LucideIcon> = {
  engineer: Ruler,
  architect: Compass,
  agent: Handshake,
  interior_designer: Sofa,
  contractor: HardHat,
};

export const CATEGORY_PLURAL: Record<PortfolioCategory, string> = {
  engineer: "Engineers",
  architect: "Architects",
  agent: "Property Agents",
  interior_designer: "Interior Designers",
  contractor: "Contractors",
};

export const FALLBACK_ICON = Briefcase;

// Order for the filter tabs.
export const CATEGORY_ORDER: PortfolioCategory[] = [
  "engineer",
  "architect",
  "agent",
  "interior_designer",
  "contractor",
];

// Curated set of schema field keys worth exposing as filters per category — the
// things a client actually narrows by. Order here is the display order. Anything
// not listed (software, NEC number, equipment, PAN, …) is intentionally omitted.
export const FILTER_KEYS: Record<PortfolioCategory, string[]> = {
  engineer: ["discipline", "services", "specializations"],
  architect: ["services", "projectTypes", "styles"],
  agent: ["propertyTypes", "services", "dealSpecialization"],
  interior_designer: ["services", "specializations", "executionModel"],
  contractor: ["services", "projectScale", "contractorClass"],
};
