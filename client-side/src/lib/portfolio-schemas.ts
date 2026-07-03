// Schema-driven definitions for the portfolio wizard's category-specific step.
// The wizard renders whatever schema matches the selected category, so adding a
// field here is all it takes to surface it in the UI. Mirrors the property
// wizard's data-driven approach, kept portfolio-specific and self-contained.

/** Category ids — must match the server's PORTFOLIO_ROLES values. */
export type PortfolioCategory =
  | "engineer"
  | "architect"
  | "agent"
  | "interior_designer"
  | "contractor";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "dropdown"
  | "card-select"
  | "chip-multiselect"
  | "toggle"
  | "stepper";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  min?: number;
  max?: number;
  /** NPR / unit hint shown as a suffix on number fields. */
  suffix?: string;
  helper?: string;
  /** Conditional visibility — field only shows when the dependency is satisfied. */
  dependsOn?: {
    field: string;
    operator: "equals" | "notEquals" | "truthy" | "falsy";
    value?: string | number | boolean;
  };
  /** Force a full-row field in the 2-col grid (auto for textarea / card-select / chip-multiselect). */
  fullWidth?: boolean;
}

export interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export interface CategoryMeta {
  id: PortfolioCategory;
  label: string;
  /** lucide-react icon name, resolved in the UI layer. */
  icon: string;
  tagline: string;
}

// Order drives the category picker in Step 1.
export const PORTFOLIO_CATEGORIES: CategoryMeta[] = [
  { id: "engineer", label: "Engineer", icon: "Ruler", tagline: "Structural, civil & site engineering" },
  { id: "architect", label: "Architect", icon: "Compass", tagline: "Design, drawings & 3D visualization" },
  { id: "agent", label: "Property Agent", icon: "Handshake", tagline: "Buy, sell, rent & land brokering" },
  { id: "interior_designer", label: "Interior Designer", icon: "Sofa", tagline: "Spaces, rendering & turnkey interiors" },
  { id: "contractor", label: "Contractor", icon: "HardHat", tagline: "Construction, renovation & finishing" },
];

export const CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  engineer: "Engineer",
  architect: "Architect",
  agent: "Property Agent",
  interior_designer: "Interior Designer",
  contractor: "Contractor",
};

// ── Category-specific field schemas ─────────────────────────────────────────

const engineerSchema: SectionConfig[] = [
  {
    id: "credentials",
    title: "Credentials & Registration",
    description: "Your NEC registration is the trust signal clients look for.",
    fields: [
      { key: "discipline", label: "Engineering discipline", type: "card-select", required: true, options: ["Civil", "Structural", "Geotechnical", "Electrical", "Mechanical", "Survey"] },
      { key: "necNumber", label: "NEC registration no.", type: "text", required: true, placeholder: "e.g. 12345 Civil A", helper: "Nepal Engineering Council" },
      { key: "necCategory", label: "NEC category", type: "dropdown", options: ["A", "B"] },
      { key: "qualification", label: "Highest qualification", type: "dropdown", options: ["Diploma", "BE", "ME", "PhD"] },
      { key: "institution", label: "Institution", type: "text", placeholder: "e.g. IOE Pulchowk Campus" },
      { key: "firm", label: "Registered firm (if any)", type: "text", placeholder: "e.g. Everest Structural Consult" },
    ],
  },
  {
    id: "expertise",
    title: "Expertise & Services",
    fields: [
      { key: "specializations", label: "Specializations", type: "chip-multiselect", options: ["RCC design", "Earthquake-resistant design", "Retrofitting", "Estimation & costing", "Site supervision", "Structural analysis"] },
      { key: "services", label: "Services offered", type: "chip-multiselect", options: ["Structural design", "Naksa pass (municipal drawing approval)", "Site supervision", "Valuation", "Soil / material testing", "Project management"] },
      { key: "software", label: "Software", type: "chip-multiselect", options: ["AutoCAD", "ETABS", "SAP2000", "Revit", "Civil 3D", "STAAD.Pro"] },
      { key: "consultationFee", label: "Consultation fee", type: "number", suffix: "NPR", placeholder: "e.g. 2000" },
    ],
  },
];

const architectSchema: SectionConfig[] = [
  {
    id: "credentials",
    title: "Credentials & Registration",
    fields: [
      { key: "necNumber", label: "NEC / RA registration no.", type: "text", required: true, placeholder: "e.g. RA-2045" },
      { key: "qualification", label: "Qualification", type: "dropdown", options: ["B.Arch", "M.Arch", "PhD"] },
      { key: "institution", label: "Institution", type: "text", placeholder: "e.g. IOE Pulchowk Campus" },
      { key: "firm", label: "Firm name (if any)", type: "text" },
    ],
  },
  {
    id: "expertise",
    title: "Design Expertise & Services",
    fields: [
      { key: "styles", label: "Design styles", type: "chip-multiselect", options: ["Modern", "Traditional Newari", "Contemporary", "Minimal", "Vastu-compliant", "Sustainable / Green"] },
      { key: "services", label: "Services", type: "chip-multiselect", options: ["Concept design", "3D visualization", "Working drawings", "Naksa approval", "Interior integration", "Landscape", "Heritage restoration"] },
      { key: "projectTypes", label: "Project types", type: "chip-multiselect", options: ["Residential", "Commercial", "Apartment", "Institutional", "Hospitality"] },
      { key: "software", label: "Software", type: "chip-multiselect", options: ["AutoCAD", "SketchUp", "Revit", "Lumion", "3ds Max", "Rhino"] },
      { key: "vastu", label: "Offers Vastu consultation", type: "toggle" },
    ],
  },
];

const agentSchema: SectionConfig[] = [
  {
    id: "business",
    title: "Business & Registration",
    fields: [
      { key: "operatingAs", label: "Operating as", type: "card-select", required: true, options: ["Independent", "Agency"] },
      { key: "agencyName", label: "Agency name", type: "text", placeholder: "e.g. NirMix Realty", dependsOn: { field: "operatingAs", operator: "equals", value: "Agency" } },
      { key: "panNumber", label: "PAN / VAT no.", type: "text", placeholder: "e.g. 601234567" },
      { key: "dealSpecialization", label: "Deal specialization", type: "dropdown", options: ["Residential", "Commercial", "Land", "Mixed"] },
    ],
  },
  {
    id: "services",
    title: "Services & Track Record",
    fields: [
      { key: "propertyTypes", label: "Property types dealt", type: "chip-multiselect", options: ["Land", "House", "Apartment", "Commercial", "Office space"] },
      { key: "services", label: "Services", type: "chip-multiselect", options: ["Buy", "Sell", "Rent", "Property management", "Land brokering (jagga dalali)", "Valuation", "Lalpurja / legal paperwork"] },
      { key: "commission", label: "Commission structure", type: "text", placeholder: "e.g. 2% of deal value" },
      { key: "dealsClosed", label: "Deals closed", type: "number", placeholder: "e.g. 40" },
      { key: "activeListings", label: "Active listings", type: "number", placeholder: "e.g. 12" },
    ],
  },
];

const interiorSchema: SectionConfig[] = [
  {
    id: "profile",
    title: "Design Profile",
    fields: [
      { key: "certification", label: "Qualification / certification", type: "text", placeholder: "e.g. B.Des Interior" },
      { key: "executionModel", label: "Execution model", type: "card-select", required: true, options: ["Design-only", "Design + Build (turnkey)"] },
      { key: "firm", label: "Firm name (if any)", type: "text" },
      { key: "budgetRange", label: "Budget range handled", type: "dropdown", options: ["Under 5 lakh", "5–15 lakh", "15–50 lakh", "50 lakh+"] },
    ],
  },
  {
    id: "expertise",
    title: "Specializations & Services",
    fields: [
      { key: "specializations", label: "Specializations", type: "chip-multiselect", options: ["Residential", "Office", "Café / Restaurant", "Retail", "Hospitality"] },
      { key: "styles", label: "Style expertise", type: "chip-multiselect", options: ["Modern", "Minimalist", "Newari", "Luxury", "Industrial", "Scandinavian"] },
      { key: "services", label: "Services", type: "chip-multiselect", options: ["Space planning", "3D rendering", "Furniture design", "Modular kitchen", "False ceiling", "Lighting design", "Turnkey execution"] },
      { key: "software", label: "Software", type: "chip-multiselect", options: ["SketchUp", "AutoCAD", "3ds Max", "V-Ray", "Enscape"] },
    ],
  },
];

const contractorSchema: SectionConfig[] = [
  {
    id: "business",
    title: "Business & Registration",
    fields: [
      { key: "operatingAs", label: "Operating as", type: "card-select", required: true, options: ["Individual", "Company"] },
      { key: "companyName", label: "Company / firm name", type: "text", required: true, placeholder: "e.g. Himalayan Builders", dependsOn: { field: "operatingAs", operator: "equals", value: "Company" } },
      { key: "contractorClass", label: "Contractor class", type: "dropdown", options: ["A", "B", "C", "D"], helper: "For registered firms", dependsOn: { field: "operatingAs", operator: "equals", value: "Company" } },
      { key: "panNumber", label: "PAN / VAT no.", type: "text" },
      { key: "crewSize", label: "Crew size", type: "stepper", min: 0, max: 500 },
    ],
  },
  {
    id: "capabilities",
    title: "Capabilities & Terms",
    fields: [
      { key: "services", label: "Services", type: "chip-multiselect", options: ["New construction", "RCC / structure", "Finishing", "Waterproofing", "Renovation", "Electrical", "Plumbing"] },
      { key: "projectScale", label: "Project scale", type: "chip-multiselect", options: ["Homes", "Apartments", "Commercial", "Industrial"] },
      { key: "equipment", label: "Owned equipment", type: "chip-multiselect", options: ["Concrete mixer", "Excavator", "Scaffolding", "Formwork", "Crane", "Vibrator"] },
      { key: "typicalDuration", label: "Typical project duration", type: "dropdown", options: ["Under 3 months", "3–6 months", "6–12 months", "1 year+"] },
      { key: "materials", label: "Materials / brands worked with", type: "text", placeholder: "e.g. Jagdamba, Hongshi, Panchakanya" },
      { key: "costRange", label: "Past-project cost range", type: "dropdown", options: ["Under 25 lakh", "25 lakh–1 crore", "1–5 crore", "5 crore+"] },
      { key: "paymentTerms", label: "Payment terms", type: "text", placeholder: "e.g. 30% advance, running bills" },
    ],
  },
];

export const PORTFOLIO_SCHEMAS: Record<PortfolioCategory, SectionConfig[]> = {
  engineer: engineerSchema,
  architect: architectSchema,
  agent: agentSchema,
  interior_designer: interiorSchema,
  contractor: contractorSchema,
};

/** Whether a conditional field should currently be shown/validated, given the filled details. */
export function isFieldVisible(field: FieldConfig, details: Record<string, unknown>): boolean {
  const dep = field.dependsOn;
  if (!dep) return true;
  const current = details[dep.field];
  switch (dep.operator) {
    case "equals": return current === dep.value;
    case "notEquals": return current !== dep.value;
    case "truthy": return !!current;
    case "falsy": return !current;
    default: return true;
  }
}
