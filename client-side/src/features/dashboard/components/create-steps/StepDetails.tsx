

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Map,
  Bed,
  Building2,
  Briefcase,
  Store,
  Users,
  User,
  Plus,
  Minus,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Compass,
  Ruler,
  Hammer,
  Sofa,
  Car,
  Sparkles,
  Building,
  ShieldCheck,
  Droplets,
  Wallet,
  Heart,
  ClipboardList,
  Wrench,
  TrendingUp,
  DollarSign,
} from "lucide-react";

interface StepDetailsProps {
  formData: any;
  onChange: (data: any) => void;
  errors: Record<string, string>;
}

interface FieldConfig {
  key: string;
  label: string;
  type:
  | "text"
  | "number"
  | "stepper"
  | "toggle"
  | "card-select"
  | "chip-multiselect"
  | "dropdown"
  | "custom-land-area"
  | "autocomplete";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  min?: number;
  max?: number;
  dependsOn?: {
    field: string;
    operator: "equals" | "notEquals" | "truthy" | "falsy";
    value?: any;
  };
  className?: string;
}

interface SectionConfig {
  id: string;
  title: string;
  fields: FieldConfig[];
}

// Icon mapping for card-select fields
const ICON_MAP: Record<string, any> = {
  "Independent": Home,
  "Villa": Home,
  "Duplex": Home,
  "Bungalow": Home,
  "Farm House": Home,

  "1 BHK": Building2,
  "2 BHK": Building2,
  "3 BHK": Building2,
  "4 BHK": Building2,
  "5+ BHK": Building2,

  "Residential": Map,
  "Commercial": Map,
  "Agricultural": Map,
  "Industrial": Map,

  "PG": Bed,
  "Independent Room": Bed,
  "Shared Flat": Bed,
  "Co-living": Bed,

  "Single": User,
  "Double": Users,
  "Triple": Users,
  "Dorm": Users,

  "Bare Shell": Briefcase,
  "Warm Shell": Briefcase,
  "Fully Furnished": Briefcase,
  "Co-working": Briefcase,
  "Business Center": Briefcase,

  "Standalone": Store,
  "Mall Unit": Store,
  "Market Complex": Store,
  "Showroom": Store,
  "Kiosk": Store,
  "Food Court": Store,

  "Bare Shell (Fixtureless)": Store,
  "Has Fixtures": Store,
  "Running Business": Store,

  "East": Compass,
  "West": Compass,
  "North": Compass,
  "South": Compass,
  "North-East": Compass,
  "North-West": Compass,
  "South-East": Compass,
  "South-West": Compass,
};

// Section icon mapping — purely cosmetic, used for the section header + quick-nav
const SECTION_ICON_MAP: Record<string, any> = {
  pricing: DollarSign,
  basic_specs: ClipboardList,
  area_measurements: Ruler,
  area: Ruler,
  project_details: Building,
  construction_condition: Hammer,
  furnishing: Sofa,
  parking_outdoor: Car,
  parking: Car,
  amenities: Sparkles,
  society_amenities: Sparkles,
  management: Wallet,
  water: Droplets,
  road_access: Compass,
  legal: ShieldCheck,
  utilities: Wrench,
  agri_details: Map,
  room_config: Bed,
  preferences: Heart,
  services: Sparkles,
  house_rules: ShieldCheck,
  space_config: Briefcase,
  building_infra: Building,
  furnishing_details: Sofa,
  suitability: TrendingUp,
  existing_setup: Store,
  commercial_viability: TrendingUp,
};

// Popular real estate projects in Nepal for autocomplete
const POPULAR_PROJECTS = [
  "Civil Homes, Bhaisepati",
  "Civil Homes, Dhapakhel",
  "Civil Homes, Kalanki",
  "Downtown Residency, Imadol",
  "Sunrise Apartments, Nakhkhu",
  "Classic Tower, Satdobato",
  "Mero City, Hattiban",
  "Cityscape Apartments, Hattiban",
  "Westar Heights, Balkumari",
  "Guna Colony, Sinamangal",
  "Central Park Apartments, Bishalnagar",
  "Vajra Heights, Swayambhu",
  "Kantipath Colony, Maharajgunj",
  "Imperial Court, Sanepa",
  "Bhatbhateni Apartment, Baluwatar",
  "Grande Towers, Tokha",
  "Lalitpur Colony, Jhamsikhel",
];

// Helper to evaluate dependency expressions
const evaluateDependency = (dependsOn: any, formData: any): boolean => {
  if (!dependsOn) return true;
  const { field, operator, value } = dependsOn;
  const targetVal = formData[field];

  switch (operator) {
    case "equals":
      return targetVal === value;
    case "notEquals":
      return targetVal !== value;
    case "truthy":
      return !!targetVal && String(targetVal).trim() !== "";
    case "falsy":
      return !targetVal || String(targetVal).trim() === "";
    default:
      return true;
  }
};

// Pricing schemas dynamically built based on listingType & propertyType
const getPricingFields = (listingType: string, propertyType: string): FieldConfig[] => {
  const isSale = listingType === "For Sale";
  if (isSale) {
    return [
      {
        key: "price",
        label: "TOTAL PRICE (RS)",
        type: "number",
        placeholder: "e.g. 35000000",
        required: true,
        className: "col-span-2 md:col-span-1"
      },
      {
        key: "pricePerUnit",
        label: propertyType === "Land" ? "PRICE / AANA (RS)" : "PRICE / SQ.FT (RS)",
        type: "number",
        placeholder: "Auto-calculated",
        className: "col-span-2 md:col-span-1"
      },
      {
        key: "ownership",
        label: "OWNERSHIP",
        type: "dropdown",
        options: ["Freehold (Lalpurja)", "Leasehold", "Guthi"],
        placeholder: "Select ownership type",
        required: true,
        className: "col-span-2 md:col-span-1"
      },
      {
        key: "negotiable",
        label: "PRICE NEGOTIABLE",
        type: "toggle",
        required: false,
        className: "col-span-2 md:col-span-1"
      }
    ];
  } else {
    const fields: FieldConfig[] = [
      {
        key: "price",
        label: "MONTHLY RENT (RS)",
        type: "number",
        placeholder: "e.g. 45000",
        required: true,
        className: "col-span-2 md:col-span-1"
      },
      {
        key: "deposit",
        label: "DEPOSIT",
        type: "text",
        placeholder: "e.g. 2 Months Rent",
        required: true,
        className: "col-span-2 md:col-span-1"
      },
      {
        key: "minLease",
        label: "MINIMUM LEASE",
        type: "text",
        placeholder: "e.g. 1 Year",
        required: true,
        className: "col-span-2 md:col-span-1"
      },
      {
        key: "availableFrom",
        label: "AVAILABLE FROM",
        type: "text",
        placeholder: "e.g. Immediately",
        required: true,
        className: "col-span-2 md:col-span-1"
      }
    ];

    if (propertyType === "Office Space" || propertyType === "Shop Space") {
      fields.push({
        key: "lockInPeriod",
        label: "LOCK-IN PERIOD (MONTHS)",
        type: "number",
        placeholder: "e.g. 12",
        required: true,
        className: "col-span-2 md:col-span-1"
      });
    }

    return fields;
  }
};

// Config schemas for all property types
const PROPERTY_SCHEMAS: Record<string, SectionConfig[]> = {
  House: [
    {
      id: "basic_specs",
      title: "Basic Specs",
      fields: [
        { key: "houseType", label: "House Type", type: "card-select", options: ["Independent", "Villa", "Duplex", "Bungalow", "Farm House"], required: true },
        { key: "beds", label: "Bedrooms", type: "stepper", required: true, min: 1, max: 10 },
        { key: "baths", label: "Bathrooms", type: "stepper", required: true, min: 1, max: 10 },
        { key: "balconies", label: "Balconies", type: "stepper", required: false, min: 0, max: 10 },
        { key: "otherRooms", label: "Other Rooms", type: "chip-multiselect", options: ["Pooja Room (Mandir)", "Study / Office Room", "Store Room", "Servant Quarter", "Kitchenette", "Guard Room"], required: false },
      ],
    },
    {
      id: "area_measurements",
      title: "Area & Measurements",
      fields: [
        { key: "landArea", label: "Plot Area", type: "custom-land-area", required: true },
        { key: "builtUpArea", label: "Built-up Area (Sq.Ft)", type: "number", placeholder: "e.g. 2500", required: true },
        { key: "carpetArea", label: "Carpet Area (Sq.Ft)", type: "number", placeholder: "e.g. 2100", required: false },
        { key: "floors", label: "Total Floors in Building", type: "number", placeholder: "e.g. 3", required: false },
      ],
    },
    {
      id: "construction_condition",
      title: "Construction & Condition",
      fields: [
        { key: "constructionStatus", label: "Construction Status", type: "toggle", options: ["Ready to Move", "Under Construction"], required: true },
        { key: "ageOfProperty", label: "Age of Property", type: "dropdown", options: ["Brand New", "1-5 Years", "5-10 Years", "10+ Years"], placeholder: "Select property age", dependsOn: { field: "constructionStatus", operator: "notEquals", value: "Under Construction" }, required: true },
        { key: "possessionDate", label: "Possession Date", type: "text", placeholder: "e.g. December 2026", dependsOn: { field: "constructionStatus", operator: "equals", value: "Under Construction" }, required: true },
        { key: "facing", label: "Facing Direction", type: "card-select", options: ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"], required: false },
        { key: "overlooking", label: "Overlooking", type: "chip-multiselect", options: ["Main Road", "Park", "Garden", "Pool", "Mountain View"], required: false },
        { key: "vastuCompliant", label: "Vastu Compliant", type: "toggle", required: false },
        { key: "reraRegistered", label: "RERA Registered", type: "toggle", required: false },
        { key: "reraId", label: "RERA ID", type: "text", placeholder: "e.g. RERA-NP-12345", dependsOn: { field: "reraRegistered", operator: "equals", value: true }, required: true },
      ],
    },
    {
      id: "furnishing",
      title: "Furnishing Status",
      fields: [
        { key: "furnishing", label: "Furnishing Status", type: "dropdown", options: ["Unfurnished", "Semi-furnished", "Fully furnished"], placeholder: "Select furnishing", required: true },
        { key: "furnishingItems", label: "Furnishing Checklist", type: "chip-multiselect", options: ["Bed", "Sofa", "Dining Table", "AC", "Wardrobe", "TV", "Refrigerator", "Washing Machine", "Modular Kitchen", "Geyser"], dependsOn: { field: "furnishing", operator: "notEquals", value: "Unfurnished" }, required: false },
      ],
    },
    {
      id: "parking_outdoor",
      title: "Parking & Outdoor",
      fields: [
        { key: "coveredParking", label: "Covered Parking", type: "stepper", required: false, min: 0, max: 10 },
        { key: "openParking", label: "Open Parking", type: "stepper", required: false, min: 0, max: 20 },
        { key: "garden", label: "Garden / Lawn", type: "toggle", required: false },
        { key: "terraceAccess", label: "Terrace Access", type: "dropdown", options: ["Private", "Shared", "None"], placeholder: "Select terrace access", required: false },
        { key: "servantQuarters", label: "Servant Quarters", type: "toggle", required: false },
      ],
    },
    {
      id: "amenities",
      title: "Amenities",
      fields: [
        { key: "amenities", label: "Amenities Checklist", type: "chip-multiselect", options: ["Power Backup", "24x7 Water", "Borewell", "Rainwater Harvesting", "Security/CCTV", "Gated Community", "Solar Panel", "Intercom", "Fire Safety", "Compound Wall", "Visitor Parking"], required: false },
      ],
    },
  ],
  Apartment: [
    {
      id: "basic_specs",
      title: "Basic Specs",
      fields: [
        { key: "bhkType", label: "BHK Type", type: "card-select", options: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"], required: true },
        { key: "baths", label: "Bathrooms", type: "stepper", required: true, min: 1, max: 10 },
        { key: "balconies", label: "Balconies", type: "stepper", required: false, min: 0, max: 10 },
        { key: "servantRoom", label: "Servant Room", type: "toggle", required: false },
        { key: "studyRoom", label: "Study Room", type: "toggle", required: false },
        { key: "openSides", label: "Open Sides", type: "stepper", required: false, min: 1, max: 4 },
      ],
    },
    {
      id: "area_measurements",
      title: "Area & Measurements",
      fields: [
        { key: "carpetArea", label: "Carpet Area (Sq.Ft)", type: "number", placeholder: "e.g. 1000", required: true },
        { key: "builtUpArea", label: "Built-up Area (Sq.Ft)", type: "number", placeholder: "e.g. 1200", required: true },
        { key: "superBuiltUpArea", label: "Super Built-up Area (Sq.Ft)", type: "number", placeholder: "e.g. 1400", required: false },
      ],
    },
    {
      id: "project_details",
      title: "Project Details",
      fields: [
        { key: "societyName", label: "Society / Project Name", type: "autocomplete", placeholder: "Type or select society name (e.g. Civil Homes)", required: true },
        { key: "totalTowers", label: "Total Towers", type: "number", placeholder: "e.g. 4", dependsOn: { field: "societyName", operator: "truthy" }, required: false },
        { key: "floorsPerTower", label: "Floors per Tower", type: "number", placeholder: "e.g. 12", dependsOn: { field: "societyName", operator: "truthy" }, required: false },
        { key: "totalUnits", label: "Total Units", type: "number", placeholder: "e.g. 250", dependsOn: { field: "societyName", operator: "truthy" }, required: false },
        { key: "floor", label: "Your Floor", type: "number", placeholder: "e.g. 7", dependsOn: { field: "societyName", operator: "truthy" }, required: true },
        { key: "lifts", label: "Lifts in Tower", type: "stepper", dependsOn: { field: "societyName", operator: "truthy" }, required: false },
        { key: "builderName", label: "Builder Name", type: "text", placeholder: "e.g. Civil Estates", dependsOn: { field: "societyName", operator: "truthy" }, required: false },
        { key: "possessionDate", label: "Possession Date", type: "text", placeholder: "e.g. June 2026", dependsOn: { field: "societyName", operator: "truthy" }, required: false },
      ],
    },
    {
      id: "construction_condition",
      title: "Construction & Condition",
      fields: [
        { key: "constructionStatus", label: "Construction Status", type: "toggle", options: ["Ready to Move", "Under Construction"], required: true },
        { key: "ageOfProperty", label: "Age of Property", type: "dropdown", options: ["Brand New", "1-5 Years", "5-10 Years", "10+ Years"], placeholder: "Select property age", dependsOn: { field: "constructionStatus", operator: "notEquals", value: "Under Construction" }, required: true },
        { key: "facing", label: "Facing Direction", type: "card-select", options: ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"], required: false },
        { key: "overlooking", label: "Overlooking", type: "chip-multiselect", options: ["Main Road", "Park", "Garden", "Pool", "Mountain View"], required: false },
        { key: "reraRegistered", label: "RERA Registered", type: "toggle", required: false },
        { key: "reraId", label: "RERA ID", type: "text", placeholder: "e.g. RERA-NP-12345", dependsOn: { field: "reraRegistered", operator: "equals", value: true }, required: true },
      ],
    },
    {
      id: "furnishing",
      title: "Furnishing Status",
      fields: [
        { key: "furnishing", label: "Furnishing Status", type: "dropdown", options: ["Unfurnished", "Semi-furnished", "Fully furnished"], placeholder: "Select furnishing", required: true },
        { key: "furnishingItems", label: "Furnishing Checklist", type: "chip-multiselect", options: ["Bed", "Sofa", "Dining Table", "AC", "Wardrobe", "TV", "Refrigerator", "Washing Machine", "Modular Kitchen", "Geyser"], dependsOn: { field: "furnishing", operator: "notEquals", value: "Unfurnished" }, required: false },
      ],
    },
    {
      id: "parking",
      title: "Parking",
      fields: [
        { key: "coveredParking", label: "Covered Parking", type: "stepper", required: false, min: 0 },
        { key: "openParking", label: "Open Parking", type: "stepper", required: false, min: 0 },
        { key: "visitorParking", label: "Visitor Parking Available", type: "toggle", required: false },
      ],
    },
    {
      id: "society_amenities",
      title: "Society Amenities",
      fields: [
        { key: "amenities", label: "Amenities Checklist", type: "chip-multiselect", options: ["Clubhouse", "Pool", "Gym", "Kids Play Area", "Jogging Track", "Indoor Games", "Banquet Hall", "Amphitheater", "Tennis/Badminton Court", "Yoga Deck", "Senior Citizen Sitout", "EV Charging", "Intercom", "Rainwater Harvesting", "STP", "Gas Pipeline", "Fire Safety", "CCTV", "Gated Community", "24x7 Power Backup", "Multipurpose Hall"], required: false },
      ],
    },
    {
      id: "management",
      title: "Management & Water",
      fields: [
        { key: "maintenanceStaff", label: "Maintenance Staff", type: "toggle", required: false },
        { key: "maintenanceCost", label: "Monthly Maintenance Cost (Rs)", type: "number", placeholder: "e.g. 5000", required: false },
        { key: "petPolicy", label: "Pet Policy", type: "dropdown", options: ["Allowed", "Not Allowed", "Restrictions Apply"], placeholder: "Select pet policy", required: false },
        { key: "waterSource", label: "Water Source", type: "dropdown", options: ["Municipal Supply (KUKL Tap)", "Groundwater (Boring / Well)", "Private Tanker Delivery", "Mixed Sources"], placeholder: "Select water source", required: false },
      ],
    },
  ],
  Flats: [
    {
      id: "basic_specs",
      title: "Basic Specs",
      fields: [
        { key: "bhkType", label: "BHK Type", type: "card-select", options: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"], required: true },
        { key: "baths", label: "Bathrooms", type: "stepper", required: true, min: 1 },
        { key: "balconies", label: "Balconies", type: "stepper", required: false, min: 0 },
        { key: "societyName", label: "Project / Building Name", type: "autocomplete", placeholder: "e.g. Lalitpur Heights", required: true },
        { key: "floor", label: "Floor Number", type: "number", placeholder: "e.g. 3", dependsOn: { field: "societyName", operator: "truthy" }, required: true },
        { key: "liftAvailable", label: "Lift Available", type: "toggle", dependsOn: { field: "societyName", operator: "truthy" }, required: false },
      ],
    },
    {
      id: "area",
      title: "Area",
      fields: [
        { key: "carpetArea", label: "Carpet Area (Sq.Ft)", type: "number", placeholder: "e.g. 900", required: false },
        { key: "builtUpArea", label: "Built-up Area (Sq.Ft)", type: "number", placeholder: "e.g. 1100", required: true },
      ],
    },
    {
      id: "construction_condition",
      title: "Construction & Condition",
      fields: [
        { key: "constructionStatus", label: "Construction Status", type: "toggle", options: ["Ready to Move", "Under Construction"], required: true },
        { key: "ageOfProperty", label: "Age of Property", type: "dropdown", options: ["Brand New", "1-5 Years", "5-10 Years", "10+ Years"], placeholder: "Select property age", dependsOn: { field: "constructionStatus", operator: "notEquals", value: "Under Construction" }, required: true },
        { key: "facing", label: "Facing Direction", type: "card-select", options: ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"], required: false },
        { key: "overlooking", label: "Overlooking", type: "chip-multiselect", options: ["Main Road", "Park", "Garden", "Pool", "Mountain View"], required: false },
        { key: "reraRegistered", label: "RERA Registered", type: "toggle", required: false },
        { key: "reraId", label: "RERA ID", type: "text", placeholder: "e.g. RERA-NP-12345", dependsOn: { field: "reraRegistered", operator: "equals", value: true }, required: true },
      ],
    },
    {
      id: "furnishing",
      title: "Furnishing Status",
      fields: [
        { key: "furnishing", label: "Furnishing Status", type: "dropdown", options: ["Unfurnished", "Semi-furnished", "Fully furnished"], placeholder: "Select furnishing", required: true },
        { key: "furnishingItems", label: "Furnishing Checklist", type: "chip-multiselect", options: ["Bed", "Sofa", "Dining Table", "AC", "Wardrobe", "TV", "Refrigerator", "Washing Machine", "Modular Kitchen", "Geyser"], dependsOn: { field: "furnishing", operator: "notEquals", value: "Unfurnished" }, required: false },
      ],
    },
    {
      id: "parking",
      title: "Parking",
      fields: [
        { key: "coveredParking", label: "Covered Parking (Car)", type: "stepper", required: false, min: 0 },
        { key: "openParking", label: "Open Parking (Bike)", type: "stepper", required: false, min: 0 },
      ],
    },
    {
      id: "water",
      title: "Water Storage & Source",
      fields: [
        { key: "waterStorageType", label: "Water Storage", type: "dropdown", options: ["Overhead Tank", "Underground Sump", "Both", "None"], placeholder: "Select storage type", required: false },
        { key: "waterSource", label: "Water Source", type: "dropdown", options: ["Municipal Supply (KUKL Tap)", "Groundwater (Boring / Well)", "Private Tanker Delivery", "Mixed Sources"], placeholder: "Select water source", required: false },
      ],
    },
    {
      id: "amenities",
      title: "Amenities",
      fields: [
        { key: "amenities", label: "Amenities Checklist", type: "chip-multiselect", options: ["Security Guard", "Power Backup", "CCTV", "Intercom", "Parking", "Lift"], required: false },
      ],
    },
  ],
  Land: [
    {
      id: "basic_specs",
      title: "Basic Specs",
      fields: [
        { key: "plotType", label: "Plot Type", type: "card-select", options: ["Residential", "Commercial", "Agricultural", "Industrial", "Farm House"], required: true },
        { key: "landArea", label: "Plot Area", type: "custom-land-area", required: true },
        { key: "dimensions", label: "Dimensions (L×B)", type: "text", placeholder: "e.g. 40x60 Ft", required: false },
        { key: "plotNumber", label: "Plot / Survey Number (Kitta No)", type: "text", placeholder: "e.g. 452", required: false },
        { key: "openSides", label: "Open Sides", type: "stepper", required: false, min: 1, max: 4 },
        { key: "boundaryWall", label: "Boundary Wall", type: "toggle", required: false },
        { key: "plotShape", label: "Plot Shape", type: "dropdown", options: ["Rectangular", "Square", "Triangular", "Irregular"], placeholder: "Select plot shape", required: false },
      ],
    },
    {
      id: "road_access",
      title: "Road & Access",
      fields: [
        { key: "roadSize", label: "Road Facing Width (Ft)", type: "number", placeholder: "e.g. 20", required: true },
        { key: "roadType", label: "Road Condition", type: "dropdown", options: ["Blacktopped (Kaalo Patre)", "Concrete Paved (Dhalai)", "Gravelled", "Dirt Road (Kuccha / Mato)"], placeholder: "Select road type", required: true },
        { key: "distanceFromMainRoad", label: "Distance from Main Road (M)", type: "number", placeholder: "e.g. 100", required: false },
        { key: "cornerPlot", label: "Corner Plot", type: "toggle", required: false },
      ],
    },
    {
      id: "legal",
      title: "Legal & Zoning",
      fields: [
        { key: "approvingAuthority", label: "Approving Authority", type: "dropdown", options: ["Kathmandu Metropolitan (KMC)", "Lalitpur Metropolitan (LMC)", "Bhaktapur Municipality", "KVDA (Valley Development)", "Local Ward Office (Wada Karyalaya)", "Others"], placeholder: "Select authority", required: false },
        { key: "landUseZone", label: "Land Use Zone", type: "dropdown", options: ["Residential", "Commercial", "Agricultural", "Industrial", "Mixed"], placeholder: "Select land use zone", required: false },
        { key: "titleType", label: "Title Type", type: "dropdown", options: ["Lalpurja (Freehold)", "Leasehold (Contractual)", "Guthi Land (Trust)", "Mohi Rights Registered"], placeholder: "Select title type", required: true },
        { key: "conversionStatus", label: "Land Conversion Status", type: "dropdown", options: ["Converted", "Pending", "Not Applicable"], placeholder: "Select conversion status", dependsOn: { field: "plotType", operator: "equals", value: "Agricultural" }, required: false },
        { key: "khataType", label: "Khata Type", type: "dropdown", options: ["Single ownership", "Joint ownership"], placeholder: "Select ownership type", required: false },
        { key: "encumbranceCertificate", label: "Encumbrance Certificate (Clear of mortgage)", type: "toggle", required: false },
      ],
    },
    {
      id: "utilities",
      title: "Utilities Connection",
      fields: [
        { key: "waterConnection", label: "Water Connection Available", type: "toggle", required: false },
        { key: "electricityConnection", label: "Electricity Connection Available", type: "toggle", required: false },
        { key: "sewageConnection", label: "Sewage Connection Available", type: "toggle", required: false },
        { key: "gasConnection", label: "Gas Pipeline Available", type: "toggle", required: false },
      ],
    },
    {
      id: "agri_details",
      title: "Agricultural Details",
      fields: [
        { key: "soilType", label: "Soil Type", type: "dropdown", options: ["Sandy", "Clay", "Loamy", "Alluvial", "Black Soil"], placeholder: "Select soil type", dependsOn: { field: "plotType", operator: "equals", value: "Agricultural" }, required: false },
        { key: "irrigationSource", label: "Irrigation Source", type: "dropdown", options: ["Canal", "Borewell Supply", "Rainfed", "River Access", "None"], placeholder: "Select irrigation source", dependsOn: { field: "plotType", operator: "equals", value: "Agricultural" }, required: false },
        { key: "currentCrop", label: "Current Crop", type: "text", placeholder: "e.g. Paddy, Wheat, Maize", dependsOn: { field: "plotType", operator: "equals", value: "Agricultural" }, required: false },
      ],
    },
  ],
  Room: [
    {
      id: "room_config",
      title: "Room Configuration",
      fields: [
        { key: "accommodationType", label: "Accommodation Type", type: "card-select", options: ["PG", "Independent Room", "Shared Flat", "Co-living"], required: true },
        { key: "sharingType", label: "Sharing Type", type: "card-select", options: ["Single", "Double", "Triple", "Dorm"], required: true },
        { key: "beds", label: "Total Beds in Room", type: "stepper", required: true, min: 1, max: 6 },
        { key: "attachedBathroom", label: "Attached Bathroom", type: "toggle", required: false },
        { key: "balcony", label: "Balcony Available", type: "toggle", required: false },
        { key: "acRoom", label: "AC Equipped", type: "toggle", required: false },
        { key: "roomSize", label: "Room Size (Sq.Ft)", type: "number", placeholder: "e.g. 150", required: false },
        { key: "furnishingItems", label: "Furnishing Inclusions", type: "chip-multiselect", options: ["Bed", "Mattress", "Wardrobe", "Study Table", "Chair", "Fan", "Heater", "Curtains"], required: false },
      ],
    },
    {
      id: "preferences",
      title: "Roommate Preferences",
      fields: [
        { key: "genderPreference", label: "Gender Preference", type: "toggle", options: ["Male", "Female", "Any"], required: true },
        { key: "occupationPreference", label: "Occupation Preference", type: "dropdown", options: ["Student", "Professional", "Any"], placeholder: "Select occupation", required: false },
        { key: "foodPreference", label: "Food Preference", type: "dropdown", options: ["Veg Only", "Non-Veg Allowed", "Any"], placeholder: "Select food preference", required: false },
      ],
    },
    {
      id: "services",
      title: "Services & Amenities",
      fields: [
        { key: "meals", label: "Meals Service", type: "dropdown", options: ["Not Included", "Veg Included", "Non-Veg Included", "All Meals Provided"], placeholder: "Select meals option", required: true },
        { key: "mealsIncluded", label: "Meals Included", type: "chip-multiselect", options: ["Breakfast", "Lunch", "Dinner"], dependsOn: { field: "meals", operator: "notEquals", value: "Not Included" }, required: true },
        { key: "housekeeping", label: "Housekeeping / Room Cleaning", type: "toggle", required: false },
        { key: "laundry", label: "Laundry Service / Washing Machine", type: "toggle", required: false },
        { key: "wifi", label: "Wifi Connection", type: "toggle", required: false },
        { key: "electricity", label: "Electricity Cost", type: "dropdown", options: ["Included in rent", "Extra - Submeter read", "Shared bill"], placeholder: "Select electricity policy", required: false },
        { key: "roWater", label: "Drinking Water (RO Filtered)", type: "toggle", required: false },
        { key: "powerBackup", label: "Power Backup (UPS/Generator)", type: "toggle", required: false },
        { key: "cctv", label: "CCTV Security", type: "toggle", required: false },
        { key: "commonAreaType", label: "Shared Common Areas", type: "chip-multiselect", options: ["Living Room", "Kitchen", "Dining Area", "Terrace", "Gym"], required: false },
      ],
    },
    {
      id: "house_rules",
      title: "House Rules",
      fields: [
        { key: "curfewTime", label: "Curfew Time", type: "dropdown", options: ["No Curfew", "9 PM", "10 PM", "11 PM", "Midnight"], placeholder: "Select curfew time", required: false },
        { key: "visitorsAllowed", label: "Visitors Policy", type: "dropdown", options: ["Yes - anytime", "No visitors", "Day visits only", "Same-gender only"], placeholder: "Select visitors policy", required: false },
        { key: "smokingDrinkingAllowed", label: "Smoking & Drinking Allowed", type: "toggle", required: false },
        { key: "couplesAllowed", label: "Couples Allowed", type: "toggle", required: false },
        { key: "noticePeriod", label: "Notice Period", type: "dropdown", options: ["1 Month", "2 Months", "None"], placeholder: "Select notice period", required: false },
      ],
    },
  ],
  "Office Space": [
    {
      id: "space_config",
      title: "Space Configuration",
      fields: [
        { key: "officeType", label: "Office Setup Type", type: "card-select", options: ["Bare Shell", "Warm Shell", "Fully Furnished", "Co-working", "Business Center"], required: true },
        { key: "carpetArea", label: "Carpet Area (Sq.Ft)", type: "number", placeholder: "e.g. 1800", required: false },
        { key: "builtUpArea", label: "Built-up Area (Sq.Ft)", type: "number", placeholder: "e.g. 2000", required: true },
        { key: "superBuiltUpArea", label: "Super Built-up Area (Sq.Ft)", type: "number", placeholder: "e.g. 2200", required: false },
        { key: "seatingCapacity", label: "Seating Capacity (Workstations)", type: "number", placeholder: "e.g. 25", required: false },
        { key: "cabins", label: "Private Cabins Count", type: "stepper", required: false, min: 0 },
        { key: "conferenceRooms", label: "Conference Rooms Count", type: "stepper", required: false, min: 0 },
        { key: "washroomsType", label: "Washrooms", type: "dropdown", options: ["Private", "Common", "Both Private & Common"], placeholder: "Select washroom configuration", required: false },
        { key: "reception", label: "Dedicated Reception Area", type: "toggle", required: false },
        { key: "pantry", label: "Pantry / Cafeteria", type: "toggle", required: false },
        { key: "serverRoom", label: "Dedicated Server Room", type: "toggle", required: false },
        { key: "storageRoom", label: "Storage / Archive Room", type: "toggle", required: false },
      ],
    },
    {
      id: "building_infra",
      title: "Building Infra & Specs",
      fields: [
        { key: "floor", label: "Floor Number", type: "number", placeholder: "e.g. 4", required: true },
        { key: "floors", label: "Total Floors in Building", type: "number", placeholder: "e.g. 7", required: false },
        { key: "lifts", label: "Lifts in Building", type: "stepper", required: false, min: 0 },
        { key: "powerBackupKva", label: "Power Backup capacity (KVA)", type: "number", placeholder: "e.g. 15", required: false },
        { key: "centralAc", label: "Centralized Air Conditioning", type: "toggle", required: false },
        { key: "cablingType", label: "IT Cabling Type", type: "dropdown", options: ["CAT6 structured cabling", "Fiber Optic", "Standard copper cabling", "Underfloor cabling"], placeholder: "Select cabling type", required: false },
        { key: "fireSafetyCompliance", label: "Fire Safety Compliance (Sprinklers/Exits)", type: "toggle", required: false },
        { key: "access24x7", label: "24/7 Building Access", type: "toggle", required: false },
        { key: "buildingGrade", label: "Building Grade", type: "dropdown", options: ["Grade A (Premium)", "Grade B (Standard)", "Grade C (Economy)"], placeholder: "Select building grade", required: false },
      ],
    },
    {
      id: "furnishing_details",
      title: "Furnishing Details",
      fields: [
        { key: "workstations", label: "Workstations Provided", type: "number", placeholder: "e.g. 20", dependsOn: { field: "officeType", operator: "equals", value: "Fully Furnished" }, required: true },
        { key: "furnishingItems", label: "Furniture Checklist", type: "chip-multiselect", options: ["Executive Desks", "Ergonomic Chairs", "Filing Cabinets", "Visitor Sofa", "Boardroom Table"], dependsOn: { field: "officeType", operator: "equals", value: "Fully Furnished" }, required: false },
        { key: "acUnitsCount", label: "AC Split Units Count", type: "stepper", dependsOn: { field: "officeType", operator: "equals", value: "Fully Furnished" }, required: false, min: 0 },
        { key: "itInfra", label: "IT Inclusions", type: "chip-multiselect", options: ["Server Rack", "Network Switches", "Wifi Routers", "Online UPS", "Projector / Display Screen"], dependsOn: { field: "officeType", operator: "equals", value: "Fully Furnished" }, required: false },
      ],
    },
    {
      id: "parking",
      title: "Parking",
      fields: [
        { key: "coveredParking", label: "Car Slots", type: "stepper", required: false, min: 0 },
        { key: "openParking", label: "Two-wheeler Slots", type: "stepper", required: false, min: 0 },
        { key: "visitorParking", label: "Visitor Parking Available", type: "toggle", required: false },
      ],
    },
    {
      id: "suitability",
      title: "Business Suitability",
      fields: [
        { key: "suitability", label: "Suitable For", type: "chip-multiselect", options: ["IT/ITES Company", "BPO/Call Center", "Bank / Financial Institution", "Co-working Space", "Startup Office", "Corporate HQ", "Healthcare Clinic", "Educational Institution"], required: false },
      ],
    },
  ],
  "Shop Space": [
    {
      id: "space_config",
      title: "Space Configuration",
      fields: [
        { key: "shopType", label: "Retail Shop Type", type: "card-select", options: ["Standalone", "Mall Unit", "Market Complex", "Showroom", "Kiosk", "Food Court"], required: true },
        { key: "carpetArea", label: "Carpet Area (Sq.Ft)", type: "number", placeholder: "e.g. 450", required: true },
        { key: "frontage", label: "Frontage Width (Ft)", type: "number", placeholder: "e.g. 15", required: false },
        { key: "ceilingHeight", label: "Ceiling Height (Ft)", type: "number", placeholder: "e.g. 10", required: false },
        { key: "floor", label: "Floor Level", type: "dropdown", options: ["Ground Floor", "1st Floor", "2nd Floor", "Basement", "Others"], placeholder: "Select floor level", required: true },
        { key: "washroom", label: "Private Washroom Available", type: "toggle", required: false },
        { key: "storageBackroom", label: "Storage Backroom Available", type: "toggle", required: false },
      ],
    },
    {
      id: "existing_setup",
      title: "Existing Setup Status",
      fields: [
        { key: "condition", label: "Condition Status", type: "card-select", options: ["Bare Shell (Fixtureless)", "Has Fixtures", "Running Business"], required: true },
        { key: "currentBusinessType", label: "Current Business Type", type: "text", placeholder: "e.g. Grocery, Clothing Boutique", dependsOn: { field: "condition", operator: "equals", value: "Running Business" }, required: true },
        { key: "yearsInOperation", label: "Years in Operation", type: "number", placeholder: "e.g. 3", dependsOn: { field: "condition", operator: "equals", value: "Running Business" }, required: false },
        { key: "interiorCondition", label: "Interior Build Condition", type: "dropdown", options: ["Brand New (Modern)", "Well Maintained", "Needs Renovation"], placeholder: "Select build condition", required: false },
      ],
    },
    {
      id: "commercial_viability",
      title: "Commercial Viability",
      fields: [
        { key: "footfallType", label: "Footfall Level", type: "dropdown", options: ["High Footfall (Busy Road/Mall)", "Medium Footfall", "Low Footfall"], placeholder: "Select footfall level", required: false },
        { key: "visibility", label: "Visibility Type", type: "dropdown", options: ["Direct Road Frontage", "Side Street View", "Internal Mall Unit", "Corner Visibility"], placeholder: "Select visibility type", required: false },
        { key: "powerLoad", label: "Available Power Load (KW)", type: "number", placeholder: "e.g. 5", required: false },
        { key: "signagePermission", label: "Signage Permission Granted", type: "toggle", required: false },
        { key: "waterConnection", label: "Water Connection Inside", type: "toggle", required: false },
        { key: "customerParking", label: "Customer Parking Available", type: "toggle", required: false },
        { key: "customerParkingCount", label: "Customer Parking Capacity (Vehicles)", type: "stepper", dependsOn: { field: "customerParking", operator: "equals", value: true }, required: false, min: 0 },
        { key: "loadingUnloading", label: "Dedicated Loading/Unloading Bay", type: "toggle", required: false },
      ],
    },
    {
      id: "suitability",
      title: "Suitability",
      fields: [
        { key: "suitability", label: "Suitable For", type: "chip-multiselect", options: ["Retail Shop", "Restaurant/Café", "Salon/Spa", "Clinic / Pharmacy", "Showroom", "Warehouse / Storage", "Bank Branch / ATM", "Grocery Store / Mini Mart"], required: false },
      ],
    },
  ],
};

export function StepDetails({ formData, onChange, errors }: StepDetailsProps) {
  const { listingType, propertyType } = formData;
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pricing: true,
    basic_specs: true,
    area_measurements: true,
    area: true,
    project_details: true,
    construction_condition: true,
    furnishing: true,
    parking_outdoor: true,
    parking: true,
    amenities: true,
    society_amenities: true,
    management: true,
    water: true,
    road_access: true,
    legal: true,
    utilities: true,
    agri_details: true,
    room_config: true,
    preferences: true,
    services: true,
    house_rules: true,
    space_config: true,
    building_infra: true,
    furnishing_details: true,
    suitability: true,
    existing_setup: true,
    commercial_viability: true,
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Refs for the quick-nav scroll-to behaviour
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleUpdate = (fields: any) => {
    const nextData = { ...formData, ...fields };

    const priceVal = Number(nextData.price) || 0;
    if (priceVal > 0) {
      if (propertyType === "Land") {
        const landAreaVal = Number(nextData.landArea) || 0;
        if (landAreaVal > 0) {
          nextData.pricePerUnit = String(Math.round(priceVal / landAreaVal));
        } else {
          nextData.pricePerUnit = "";
        }
      } else {
        const sqftVal = Number(nextData.builtUpArea) || Number(nextData.carpetArea) || Number(nextData.roomSize) || 0;
        if (sqftVal > 0) {
          nextData.pricePerUnit = String(Math.round(priceVal / sqftVal));
        } else {
          nextData.pricePerUnit = "";
        }
      }
    } else {
      nextData.pricePerUnit = "";
    }

    onChange(nextData);
  };

  useEffect(() => {
    const getRequiredFields = (): string[] => {
      const required: string[] = [];
      const pricingFields = getPricingFields(listingType, propertyType);

      pricingFields.forEach(field => {
        if (field.required) {
          required.push(field.key);
        }
      });

      const activeSections = PROPERTY_SCHEMAS[propertyType] || [];
      activeSections.forEach(section => {
        section.fields.forEach(field => {
          const isVisible = evaluateDependency(field.dependsOn, formData);
          if (isVisible && field.required) {
            required.push(field.key);
          }
        });
      });

      return required;
    };

    const required = getRequiredFields();
    const filled = required.filter(key => {
      const val = formData[key];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== null && String(val).trim() !== "";
    });

    const totalRequired = required.length;
    const filledCount = filled.length;
    const pct = totalRequired > 0 ? Math.round((filledCount / totalRequired) * 100) : 100;
    const stepIsValid = filledCount === totalRequired;

    if (formData.detailsCompletion !== pct || formData.isDetailsValid !== stepIsValid) {
      onChange({
        ...formData,
        detailsCompletion: pct,
        isDetailsValid: stepIsValid
      });
    }
  }, [formData, propertyType, listingType, onChange]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: true }));
    requestAnimationFrame(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // Theme-aware accents
  const isRent = listingType === "For Rent";
  const accentText = isRent ? "text-[#24A148]" : "text-[#B98F1F]";
  const accentBg = isRent ? "bg-[#24A148]" : "bg-[#E5C158]";
  const accentBgSoft = isRent ? "bg-[#24A148]/10" : "bg-[#E5C158]/15";

  const inputStyle = (hasError: boolean) =>
    `nm-input px-4 py-3 text-xs font-semibold ${hasError ? "!border-red-500 ring-2 ring-red-100" : ""}`;

  const labelStyle = "nm-label";

  const renderField = (field: FieldConfig) => {
    const hasError = !!errors[field.key];
    const activeColor = isRent ? "bg-[#24A148] text-white" : "bg-[#E5C158] text-[#342417]";

    switch (field.type) {
      case "text":
      case "number":
        return (
          <div className="w-full">
            <input
              type={field.type}
              value={formData[field.key] || ""}
              onChange={(e) => handleUpdate({ [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className={inputStyle(hasError)}
            />
            {hasError && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors[field.key]}</p>}
          </div>
        );

      case "dropdown":
        return (
          <div className="relative w-full">
            <select
              value={formData[field.key] || ""}
              onChange={(e) => handleUpdate({ [field.key]: e.target.value })}
              className={`appearance-none cursor-pointer pr-10 ${inputStyle(hasError)}`}
            >
              <option value="" disabled>{field.placeholder || "Select option"}</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#342417]/50">
              <ChevronDown className="h-4 w-4" />
            </div>
            {hasError && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors[field.key]}</p>}
          </div>
        );

      case "stepper": {
        const numVal = Number(formData[field.key]) || 0;
        return (
          <div className="nm-track flex items-center justify-between p-1 rounded-xl w-32">
            <button
              type="button"
              onClick={() => handleUpdate({ [field.key]: Math.max((field.min ?? 0), numVal - 1) })}
              className="nm-btn nm-btn-paper w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 text-[#342417]"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs font-black text-[#342417]">{numVal}</span>
            <button
              type="button"
              onClick={() => handleUpdate({ [field.key]: numVal + 1 })}
              className="nm-btn nm-btn-paper w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 text-[#342417]"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        );
      }

      case "toggle": {
        const isTrue = !!formData[field.key];
        const toggleOptions = field.options || ["Yes", "No"];
        return (
          <div className="nm-track flex p-1 rounded-xl w-44">
            <button
              type="button"
              onClick={() => handleUpdate({ [field.key]: true })}
              className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer active:scale-95 duration-200 ${isTrue ? `${activeColor} shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_5px_rgba(90,66,38,0.22)]` : "text-[#342417]/50 hover:text-[#342417]"
                }`}
            >
              {toggleOptions[0]}
            </button>
            <button
              type="button"
              onClick={() => handleUpdate({ [field.key]: false })}
              className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer active:scale-95 duration-200 ${!isTrue ? `${activeColor} shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_5px_rgba(90,66,38,0.22)]` : "text-[#342417]/50 hover:text-[#342417]"
                }`}
            >
              {toggleOptions[1]}
            </button>
          </div>
        );
      }

      case "card-select": {
        return (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 w-full">
            {field.options?.map((opt) => {
              const isSelected = formData[field.key] === opt;
              const Icon = ICON_MAP[opt] || HelpCircle;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleUpdate({ [field.key]: opt })}
                  className={`nm-tile relative flex flex-col items-start justify-between p-3.5 text-left cursor-pointer h-20 active:scale-[0.98] ${isSelected ? "is-selected" : ""}`}
                >
                  {isSelected && (
                    <span
                      className="absolute top-2.5 right-2.5 h-3.5 w-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-black"
                      style={{ backgroundColor: "var(--nm-accent)" }}
                    >
                      ✓
                    </span>
                  )}
                  <Icon
                    className="h-4.5 w-4.5"
                    style={{ color: isSelected ? "var(--nm-accent)" : "rgba(92,77,60,0.6)" }}
                  />
                  <span className="block text-[10px] font-black tracking-tight leading-none mt-1.5 uppercase text-[#342417]">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        );
      }

      case "chip-multiselect": {
        const activeChips = formData[field.key] || [];
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => {
              const isChecked = activeChips.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const nextVal = isChecked
                      ? activeChips.filter((i: any) => i !== opt)
                      : [...activeChips, opt];
                    handleUpdate({ [field.key]: nextVal });
                  }}
                  className={`nm-chip px-3 py-1.5 text-xs cursor-pointer flex items-center gap-1.5 active:scale-[0.97] ${isChecked ? "is-selected font-black text-[#342417]" : "font-bold text-[#342417]/60 hover:text-[#342417]"}`}
                >
                  {isChecked && <Check className="h-3 w-3 stroke-[2.5px]" style={{ color: "var(--nm-accent)" }} />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        );
      }

      case "autocomplete":
        return (
          <div className="relative w-full">
            <input
              type="text"
              value={formData[field.key] || ""}
              onChange={(e) => {
                const val = e.target.value;
                handleUpdate({ [field.key]: val });
                if (val.trim().length > 1) {
                  const filtered = POPULAR_PROJECTS.filter(p => p.toLowerCase().includes(val.toLowerCase()));
                  setSuggestions(filtered);
                  setShowSuggestions(true);
                } else {
                  setSuggestions([]);
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                const val = formData[field.key] || "";
                if (val.trim().length > 1) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder={field.placeholder}
              className={inputStyle(hasError)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="nm-panel absolute z-50 w-full mt-1 shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      handleUpdate({ [field.key]: sug });
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#F4EDDA] text-xs font-semibold text-[#342417] transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
            {hasError && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors[field.key]}</p>}
          </div>
        );

      case "custom-land-area": {
        const currentUnit = formData.landAreaUnit || "Aana";

        const handleUnitChange = (newUnit: string) => {
          handleUpdate({
            landAreaUnit: newUnit,
            landArea: "",
            ropani: "",
            aana: "",
            paisa: "",
            daam: "",
            bigha: "",
            kattha: "",
            dhur: ""
          });
        };

        const handleNepaleseConversion = (subField: string, val: string) => {
          const updated = { ...formData, [subField]: val };
          const r = Number(updated.ropani) || 0;
          const a = Number(updated.aana) || 0;
          const p = Number(updated.paisa) || 0;
          const d = Number(updated.daam) || 0;
          const totalAana = r * 16 + a + p / 4 + d / 16;

          handleUpdate({
            [subField]: val,
            landArea: totalAana > 0 ? String(totalAana) : ""
          });
        };

        const handleTeraiConversion = (subField: string, val: string) => {
          const updated = { ...formData, [subField]: val };
          const b = Number(updated.bigha) || 0;
          const k = Number(updated.kattha) || 0;
          const dh = Number(updated.dhur) || 0;
          const totalKattha = b * 20 + k + dh / 20;

          handleUpdate({
            [subField]: val,
            landArea: totalKattha > 0 ? String(totalKattha) : ""
          });
        };

        return (
          <div className="space-y-3 w-full">
            <div className="nm-track flex flex-wrap p-1 rounded-lg w-full sm:w-fit gap-1">
              {[
                { label: "Aana/Ropani", key: "Aana" },
                { label: "Bigha/Kattha", key: "Kattha" },
                { label: "Sq. Ft", key: "Sq. Ft" },
                { label: "Sq. M", key: "Sq. M" }
              ].map((opt) => {
                const isSelected = currentUnit === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleUnitChange(opt.key)}
                    className={`px-3 py-1.5 text-center text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${isSelected ? `${activeColor} shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_5px_rgba(90,66,38,0.22)]` : "text-[#342417]/60 hover:text-[#342417]"}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {currentUnit === "Aana" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="relative">
                  <input type="number" value={formData.ropani || ""} onChange={(e) => handleNepaleseConversion("ropani", e.target.value)} placeholder="Ropani" className="w-full px-3 py-2.5 pr-14 nm-input rounded-lg text-xs font-semibold text-right" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#342417]/40 font-extrabold uppercase pointer-events-none">Ropani</span>
                </div>
                <div className="relative">
                  <input type="number" value={formData.aana || ""} onChange={(e) => handleNepaleseConversion("aana", e.target.value)} placeholder="Aana" className="w-full px-3 py-2.5 pr-12 nm-input rounded-lg text-xs font-semibold text-right" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#342417]/40 font-extrabold uppercase pointer-events-none">Aana</span>
                </div>
                <div className="relative">
                  <input type="number" value={formData.paisa || ""} onChange={(e) => handleNepaleseConversion("paisa", e.target.value)} placeholder="Paisa" className="w-full px-3 py-2.5 pr-12 nm-input rounded-lg text-xs font-semibold text-right" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#342417]/40 font-extrabold uppercase pointer-events-none">Paisa</span>
                </div>
                <div className="relative">
                  <input type="number" value={formData.daam || ""} onChange={(e) => handleNepaleseConversion("daam", e.target.value)} placeholder="Daam" className="w-full px-3 py-2.5 pr-12 nm-input rounded-lg text-xs font-semibold text-right" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#342417]/40 font-extrabold uppercase pointer-events-none">Daam</span>
                </div>
              </div>
            )}

            {currentUnit === "Kattha" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="relative">
                  <input type="number" value={formData.bigha || ""} onChange={(e) => handleTeraiConversion("bigha", e.target.value)} placeholder="Bigha" className="w-full px-3 py-2.5 pr-14 nm-input rounded-lg text-xs font-semibold text-right" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#342417]/40 font-extrabold uppercase pointer-events-none">Bigha</span>
                </div>
                <div className="relative">
                  <input type="number" value={formData.kattha || ""} onChange={(e) => handleTeraiConversion("kattha", e.target.value)} placeholder="Kattha" className="w-full px-3 py-2.5 pr-14 nm-input rounded-lg text-xs font-semibold text-right" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#342417]/40 font-extrabold uppercase pointer-events-none">Kattha</span>
                </div>
                <div className="relative">
                  <input type="number" value={formData.dhur || ""} onChange={(e) => handleTeraiConversion("dhur", e.target.value)} placeholder="Dhur" className="w-full px-3 py-2.5 pr-14 nm-input rounded-lg text-xs font-semibold text-right" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#342417]/40 font-extrabold uppercase pointer-events-none">Dhur</span>
                </div>
              </div>
            )}

            {(currentUnit === "Sq. Ft" || currentUnit === "Sq. M") && (
              <div className="relative w-full">
                <input type="number" value={formData.landArea || ""} onChange={(e) => handleUpdate({ landArea: e.target.value })} placeholder={`Enter area in ${currentUnit}`} className="w-full px-3 py-2.5 pr-14 nm-input rounded-lg text-xs font-semibold text-right" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#342417]/40 font-extrabold uppercase pointer-events-none">{currentUnit}</span>
              </div>
            )}

            {formData.landArea && (
              <p className="text-[10px] text-[#5C4D3C]/70 font-extrabold uppercase tracking-wide">
                Total Calculated Area: <span className="text-[#342417] font-black">{Number(formData.landArea).toFixed(3)} {currentUnit === "Aana" ? "Aana" : currentUnit === "Kattha" ? "Kattha" : currentUnit}</span>
              </p>
            )}
            {hasError && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors[field.key]}</p>}
          </div>
        );
      }

      default:
        return null;
    }
  };

  const pricingFields = getPricingFields(listingType, propertyType);
  const pricingSection: SectionConfig = {
    id: "pricing",
    title: "Pricing & Rent Terms",
    fields: pricingFields,
  };

  const baseSections = PROPERTY_SCHEMAS[propertyType] || [];
  const activeSections: SectionConfig[] = [];

  if (propertyType === "Land" || propertyType === "Room") {
    if (baseSections[0]) activeSections.push(baseSections[0]);
    activeSections.push(pricingSection);
    for (let i = 1; i < baseSections.length; i++) activeSections.push(baseSections[i]);
  } else if (propertyType === "Office Space" || propertyType === "Shop Space") {
    if (baseSections[0]) activeSections.push(baseSections[0]);
    activeSections.push(pricingSection);
    for (let i = 1; i < baseSections.length; i++) activeSections.push(baseSections[i]);
  } else {
    if (baseSections[0]) activeSections.push(baseSections[0]);
    if (baseSections[1]) activeSections.push(baseSections[1]);
    activeSections.push(pricingSection);
    for (let i = 2; i < baseSections.length; i++) activeSections.push(baseSections[i]);
  }

  // Sections that actually have at least one visible field (used for quick-nav + rendering)
  const visibleSectionMeta = activeSections
    .map((section) => ({
      section,
      visibleFields: section.fields.filter((f) => evaluateDependency(f.dependsOn, formData)),
    }))
    .filter((s) => s.visibleFields.length > 0);

  // Per-section completion (for the little progress dot in the quick-nav + section header)
  const getSectionCompletion = (section: SectionConfig, visibleFields: FieldConfig[]) => {
    const requiredFields = visibleFields.filter((f) => f.required);
    if (requiredFields.length === 0) return { isComplete: true, hasRequired: false };
    const filledCount = requiredFields.filter((f) => {
      const val = formData[f.key];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== null && String(val).trim() !== "";
    }).length;
    return { isComplete: filledCount === requiredFields.length, hasRequired: true };
  };

  return (
    <div className="space-y-5 pb-6 select-none">
      {/* Quick section navigator — sticky chip row for jumping between sections */}
      <div className="sticky top-0 z-20 -mx-1 px-1 pb-2 bg-linear-to-b from-[#F4ECD9] via-[#F4ECD9] to-transparent">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {visibleSectionMeta.map(({ section, visibleFields }) => {
            const Icon = SECTION_ICON_MAP[section.id] || ClipboardList;
            const { isComplete, hasRequired } = getSectionCompletion(section, visibleFields);
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`nm-chip flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold whitespace-nowrap cursor-pointer shrink-0 ${expandedSections[section.id]
                    ? "is-selected text-[#342417]"
                    : "text-[#342417]/60 hover:text-[#342417]"
                  }`}
              >
                <Icon className="h-3 w-3" />
                <span>{section.title}</span>
                {hasRequired && (
                  <span className={`h-1.5 w-1.5 rounded-full ${isComplete ? accentBg : "bg-[#D6451D]/60"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {visibleSectionMeta.map(({ section, visibleFields }) => {
          const isExpanded = expandedSections[section.id] !== false;
          const Icon = SECTION_ICON_MAP[section.id] || ClipboardList;
          const { isComplete, hasRequired } = getSectionCompletion(section, visibleFields);

          return (
            <div
              key={section.id}
              ref={(el) => { sectionRefs.current[section.id] = el; }}
              className={`nm-panel transition-all duration-200 overflow-hidden ${isExpanded ? "" : "opacity-95"
                }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-left focus:outline-none hover:bg-[#FAF9F6]/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex items-center justify-center h-8 w-8 rounded-xl shrink-0 ${accentBgSoft}`}>
                    <Icon className={`h-4 w-4 ${accentText}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-[13px] font-black uppercase text-[#342417] tracking-wider truncate">
                      {section.title}
                    </h3>
                    {hasRequired && (
                      <span className={`text-[9px] font-bold ${isComplete ? "text-[#24A148]" : "text-[#5C4D3C]/50"}`}>
                        {isComplete ? "Complete" : "Required fields pending"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {hasRequired && !isComplete && (
                    <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-[#D6451D]/60" />
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#342417]/60" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#342417]/60" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#F0EAE0] animate-[fadeIn_0.2s_ease-out]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3.5">
                    {visibleFields.map((field) => {
                      const isFullWidth =
                        field.type === "card-select" ||
                        field.type === "chip-multiselect" ||
                        field.type === "custom-land-area";

                      const widthClass = isFullWidth ? "col-span-1 md:col-span-2" : field.className || "col-span-1";

                      return (
                        <div key={field.key} className={`${widthClass} space-y-1.5`}>
                          <label className={labelStyle}>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {renderField(field)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}