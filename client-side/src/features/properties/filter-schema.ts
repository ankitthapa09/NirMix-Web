import type { ListingStatusFilter } from "./types";

// A single dynamic control rendered inside the filter sidebar.
export type FilterControl =
  | { key: string; label: string; kind: "chips"; options: string[] }
  | { key: string; label: string; kind: "select"; options: string[] }
  | { key: string; label: string; kind: "toggle" };

export interface FilterSection {
  title: string;
  controls: FilterControl[];
}

/**
 * Builds the dynamic filter sections for the current status + category,
 * mirroring the field sets used in the property-create flow (StepDetails).
 * Status drives commercial terms; category drives type-specific specs.
 */
export function getDynamicSections(
  listingType: ListingStatusFilter,
  category: string
): FilterSection[] {
  const sections: FilterSection[] = [];

  // ── Status-specific (Buy vs Rent) ──
  if (listingType === "sale") {
    sections.push({
      title: "Ownership",
      controls: [
        {
          key: "ownership",
          label: "Ownership",
          kind: "chips",
          options: ["Freehold (Lalpurja)", "Leasehold", "Guthi"],
        },
        { key: "negotiable", label: "Price negotiable only", kind: "toggle" },
      ],
    });
  } else if (listingType === "rent") {
    sections.push({
      title: "Rental terms",
      controls: [
        {
          key: "furnishing",
          label: "Furnishing",
          kind: "chips",
          options: ["Unfurnished", "Semi-furnished", "Fully furnished"],
        },
        {
          key: "availability",
          label: "Available from",
          kind: "select",
          options: ["Immediately", "Within 15 days", "Within a month", "Flexible"],
        },
      ],
    });
  }

  // ── Category-specific specs ──
  switch (category) {
    case "House":
      sections.push(
        {
          title: "House type",
          controls: [
            {
              key: "houseType",
              label: "House type",
              kind: "chips",
              options: ["Independent", "Villa", "Duplex", "Bungalow"],
            },
          ],
        },
        {
          title: "Orientation & parking",
          controls: [
            { key: "facing", label: "Facing", kind: "chips", options: ["East", "West", "North", "South"] },
            { key: "parking", label: "Parking", kind: "chips", options: ["Car", "Bike", "2+ Cars"] },
          ],
        },
        {
          title: "Amenities",
          controls: [
            {
              key: "amenities",
              label: "Amenities",
              kind: "chips",
              options: ["Power Backup", "24x7 Water", "Security / CCTV", "Garden", "Solar", "Parking"],
            },
          ],
        }
      );
      break;

    case "Apartment":
      sections.push(
        {
          title: "Configuration",
          controls: [
            {
              key: "bhk",
              label: "BHK type",
              kind: "chips",
              options: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"],
            },
          ],
        },
        {
          title: "Building",
          controls: [
            { key: "facing", label: "Facing", kind: "chips", options: ["East", "West", "North", "South"] },
            {
              key: "floorPref",
              label: "Floor preference",
              kind: "select",
              options: ["Lower (1–3)", "Mid (4–7)", "Higher (8+)"],
            },
          ],
        },
        {
          title: "Society amenities",
          controls: [
            {
              key: "amenities",
              label: "Amenities",
              kind: "chips",
              options: ["Lift", "Gym", "Pool", "Clubhouse", "CCTV", "Power Backup", "Parking"],
            },
          ],
        }
      );
      break;

    case "Land":
      sections.push(
        {
          title: "Plot type",
          controls: [
            {
              key: "plotType",
              label: "Plot type",
              kind: "chips",
              options: ["Residential", "Commercial", "Agricultural", "Industrial"],
            },
          ],
        },
        {
          title: "Road & access",
          controls: [
            {
              key: "roadType",
              label: "Road condition",
              kind: "select",
              options: ["Blacktopped", "Concrete Paved", "Gravelled", "Dirt Road"],
            },
            { key: "facing", label: "Facing", kind: "chips", options: ["East", "West", "North", "South"] },
            { key: "cornerPlot", label: "Corner plot only", kind: "toggle" },
          ],
        }
      );
      break;

    case "Flats":
      sections.push(
        {
          title: "Configuration",
          controls: [
            {
              key: "bhk",
              label: "BHK type",
              kind: "chips",
              options: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"],
            },
          ],
        },
        {
          title: "Building",
          controls: [
            {
              key: "floorPref",
              label: "Floor preference",
              kind: "select",
              options: ["Lower (1–3)", "Mid (4–7)", "Higher (8+)"],
            },
            { key: "liftAvailable", label: "Lift available", kind: "toggle" },
          ],
        },
        {
          title: "Amenities",
          controls: [
            {
              key: "amenities",
              label: "Amenities",
              kind: "chips",
              options: ["Security Guard", "Power Backup", "CCTV", "Intercom", "Parking", "Lift"],
            },
          ],
        }
      );
      break;

    case "Room":
      sections.push(
        {
          title: "Accommodation",
          controls: [
            {
              key: "accommodation",
              label: "Type",
              kind: "chips",
              options: ["PG", "Independent Room", "Shared Flat", "Co-living"],
            },
            {
              key: "sharing",
              label: "Sharing",
              kind: "chips",
              options: ["Single", "Double", "Triple"],
            },
          ],
        },
        {
          title: "Preferences",
          controls: [
            { key: "gender", label: "Tenant gender", kind: "chips", options: ["Male", "Female", "Any"] },
            { key: "attachedBath", label: "Attached bathroom", kind: "toggle" },
          ],
        }
      );
      break;

    case "Office Space":
      sections.push(
        {
          title: "Office setup",
          controls: [
            {
              key: "officeType",
              label: "Setup type",
              kind: "chips",
              options: ["Bare Shell", "Warm Shell", "Fully Furnished", "Co-working", "Business Center"],
            },
          ],
        },
        {
          title: "Building & specs",
          controls: [
            {
              key: "buildingGrade",
              label: "Building grade",
              kind: "select",
              options: ["Grade A (Premium)", "Grade B (Standard)", "Grade C (Economy)"],
            },
            { key: "centralAc", label: "Central air conditioning", kind: "toggle" },
            { key: "access24x7", label: "24/7 access", kind: "toggle" },
          ],
        },
        {
          title: "Suitable for",
          controls: [
            {
              key: "suitability",
              label: "Suitable for",
              kind: "chips",
              options: ["IT / ITES", "BPO / Call Center", "Startup Office", "Corporate HQ", "Co-working", "Clinic"],
            },
          ],
        }
      );
      break;

    case "Shop Space":
      sections.push(
        {
          title: "Shop type",
          controls: [
            {
              key: "shopType",
              label: "Shop type",
              kind: "chips",
              options: ["Standalone", "Mall Unit", "Market Complex", "Showroom", "Kiosk", "Food Court"],
            },
          ],
        },
        {
          title: "Commercial viability",
          controls: [
            {
              key: "footfall",
              label: "Footfall",
              kind: "select",
              options: ["High (Busy Road / Mall)", "Medium", "Low"],
            },
            {
              key: "visibility",
              label: "Visibility",
              kind: "select",
              options: ["Direct Road Frontage", "Side Street", "Internal Mall Unit", "Corner"],
            },
          ],
        },
        {
          title: "Existing setup",
          controls: [
            {
              key: "condition",
              label: "Condition",
              kind: "chips",
              options: ["Bare Shell", "Has Fixtures", "Running Business"],
            },
          ],
        }
      );
      break;
  }

  return sections;
}

// Bedrooms/Bathrooms only apply to dwellings — not land or commercial spaces.
export function showsBedBath(category: string): boolean {
  return category === "" || ["House", "Apartment", "Flats"].includes(category);
}
