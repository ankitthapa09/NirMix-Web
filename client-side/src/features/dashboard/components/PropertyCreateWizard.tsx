"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { StepBasics } from "./create-steps/StepBasics";
import { StepLocation } from "./create-steps/StepLocation";
import { StepDetails } from "./create-steps/StepDetails";
import { StepMedia } from "./create-steps/StepMedia";
import { StepReview } from "./create-steps/StepReview";
import { PropertyFormData, MediaItem, isMediaItem } from "./create-steps/types";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";

const STEPS = [
  { label: "Basics", desc: "Type & Description" },
  { label: "Location", desc: "Address & Map Pin" },
  { label: "Details", desc: "Specs & Pricing" },
  { label: "Media", desc: "Photos & Floor Plans" },
  { label: "Review", desc: "Verify & Publish" },
];

const INITIAL_FORM_STATE = {
  listingType: "For Sale",
  propertyType: "House",
  title: "",
  description: "",
  province: "",
  district: "",
  city: "",
  wardNo: "",
  area: "",
  landmark: "",
  price: "",
  negotiable: true,
  ownership: "",
  deposit: "",
  beds: "",
  baths: "",
  balconies: "",
  floor: "",
  floors: "",
  parking: "",
  builtUpArea: "",
  carpetArea: "",
  landArea: "",
  ropani: "",
  aana: "",
  paisa: "",
  daam: "",
  facing: "",
  furnishing: "",
  leaseTerm: "",
  minLease: "",
  availableFrom: "",
  zoning: "",
  roadSize: "",
  frontage: "",
  roadType: "",
  pricePerUnit: "",
  floorLevel: "",
  sharedFacilities: [],
  amenities: [],
  photos: [],
  videoLink: "",
  floorPlan: null,
  termsAccepted: false,
};

const isLatLng = (v: unknown): v is { lat: number; lng: number } =>
  !!v &&
  typeof v === "object" &&
  typeof (v as Record<string, unknown>).lat === "number" &&
  typeof (v as Record<string, unknown>).lng === "number";

const sanitizeData = (input: unknown): PropertyFormData => {
  if (!input || typeof input !== "object") return INITIAL_FORM_STATE;
  const data = input as Record<string, unknown>;

  return {
    listingType: typeof data.listingType === "string" ? data.listingType : "For Sale",
    propertyType: typeof data.propertyType === "string" ? data.propertyType : "House",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    province: typeof data.province === "string" ? data.province : "",
    district: typeof data.district === "string" ? data.district : "",
    city: typeof data.city === "string" ? data.city : "",
    wardNo: typeof data.wardNo === "string" || typeof data.wardNo === "number" ? String(data.wardNo) : "",
    area: typeof data.area === "string" ? data.area : "",
    landmark: typeof data.landmark === "string" ? data.landmark : "",
    coordinates: isLatLng(data.coordinates) ? data.coordinates : undefined,
    price: typeof data.price === "string" || typeof data.price === "number" ? String(data.price) : "",
    negotiable: data.negotiable !== false,
    ownership: typeof data.ownership === "string" ? data.ownership : "",
    deposit: typeof data.deposit === "string" || typeof data.deposit === "number" ? String(data.deposit) : "",
    beds: typeof data.beds === "string" || typeof data.beds === "number" ? String(data.beds) : "",
    baths: typeof data.baths === "string" || typeof data.baths === "number" ? String(data.baths) : "",
    balconies: typeof data.balconies === "string" || typeof data.balconies === "number" ? String(data.balconies) : "",
    floor: typeof data.floor === "string" || typeof data.floor === "number" ? String(data.floor) : "",
    floors: typeof data.floors === "string" || typeof data.floors === "number" ? String(data.floors) : "",
    parking: typeof data.parking === "string" ? data.parking : "",
    builtUpArea: typeof data.builtUpArea === "string" || typeof data.builtUpArea === "number" ? String(data.builtUpArea) : "",
    carpetArea: typeof data.carpetArea === "string" || typeof data.carpetArea === "number" ? String(data.carpetArea) : "",
    landArea: typeof data.landArea === "string" || typeof data.landArea === "number" ? String(data.landArea) : "",
    ropani: typeof data.ropani === "string" || typeof data.ropani === "number" ? String(data.ropani) : "",
    aana: typeof data.aana === "string" || typeof data.aana === "number" ? String(data.aana) : "",
    paisa: typeof data.paisa === "string" || typeof data.paisa === "number" ? String(data.paisa) : "",
    daam: typeof data.daam === "string" || typeof data.daam === "number" ? String(data.daam) : "",
    facing: typeof data.facing === "string" ? data.facing : "",
    furnishing: typeof data.furnishing === "string" ? data.furnishing : "",
    leaseTerm: typeof data.leaseTerm === "string" || typeof data.leaseTerm === "number" ? String(data.leaseTerm) : "",
    minLease: typeof data.minLease === "string" || typeof data.minLease === "number" ? String(data.minLease) : "",
    availableFrom: typeof data.availableFrom === "string" ? data.availableFrom : "",
    zoning: typeof data.zoning === "string" ? data.zoning : "",
    roadSize: typeof data.roadSize === "string" || typeof data.roadSize === "number" ? String(data.roadSize) : "",
    frontage: typeof data.frontage === "string" || typeof data.frontage === "number" ? String(data.frontage) : "",
    roadType: typeof data.roadType === "string" ? data.roadType : "",
    pricePerUnit: typeof data.pricePerUnit === "string" || typeof data.pricePerUnit === "number" ? String(data.pricePerUnit) : "",
    floorLevel: typeof data.floorLevel === "string" || typeof data.floorLevel === "number" ? String(data.floorLevel) : "",
    sharedFacilities: Array.isArray(data.sharedFacilities) ? data.sharedFacilities : [],
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    photos: Array.isArray(data.photos) ? data.photos.filter(isMediaItem) : [],
    videoLink: typeof data.videoLink === "string" ? data.videoLink : "",
    floorPlan: isMediaItem(data.floorPlan) ? data.floorPlan : null,
    termsAccepted: !!data.termsAccepted,
  };
};

const API_BASE = "http://localhost:5001/api";

// Fields sent top-level / handled separately; everything else on the wizard's flat
// formData is bundled into `details` to match the API's create contract.
const TOP_LEVEL_FIELDS = new Set([
  "listingType", "propertyType", "title", "description",
  "province", "district", "city", "wardNo", "area", "landmark", "coordinates",
  "price", "videoLink",
  "photos", "floorPlan", "termsAccepted", "detailsCompletion", "isDetailsValid",
]);

// Map the wizard's flat formData onto the API's `data` JSON contract.
const buildListingPayload = (formData: PropertyFormData) => {
  const details: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(formData)) {
    if (TOP_LEVEL_FIELDS.has(key)) continue;
    details[key] = value;
  }

  return {
    listingType: formData.listingType,
    propertyType: formData.propertyType,
    title: formData.title,
    description: formData.description,
    location: {
      province: formData.province,
      district: formData.district,
      city: formData.city,
      wardNo: formData.wardNo,
      area: formData.area,
      landmark: formData.landmark || "",
      ...(formData.coordinates ? { coordinates: formData.coordinates } : {}),
    },
    price: Number(formData.price) || 0,
    videoLink: formData.videoLink || "",
    details,
  };
};

interface PropertyCreateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  /** When set, the wizard runs in edit mode (PATCH) instead of create (POST). */
  editId?: string;
  /** Prefilled form data for edit mode. */
  editData?: Partial<PropertyFormData> | null;
}

export function PropertyCreateWizard({ isOpen, onClose, editId, editData }: PropertyCreateWizardProps) {
  const isEditMode = !!editId;
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<PropertyFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [, setDraftSavedAt] = useState<string | null>(null);
  const { accessToken } = useAuth();

  // Load draft from localStorage on mount — one-time sync from an external store
  // into React state, so a direct setState here is intentional.
  useEffect(() => {
    if (!isOpen) return;

    // Edit mode: prefill from the existing listing; ignore any create-draft.
    if (editData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ ...INITIAL_FORM_STATE, ...editData });
      return;
    }

    const savedDraft = localStorage.getItem("nirmix_property_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        const sanitized = sanitizeData(parsed);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(sanitized);
        toast.info("Restored property draft.");
      } catch (e) {
        console.error("Failed to restore draft", e);
      }
    }
  }, [isOpen, editData]);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const saveDraft = (data: PropertyFormData) => {
    try {
      const dataToSave: Record<string, unknown> = { ...data };
      if (Array.isArray(dataToSave.photos)) {
        dataToSave.photos = (dataToSave.photos as MediaItem[]).map((p) => ({ url: p.url, name: p.name }));
      }
      if (isMediaItem(dataToSave.floorPlan)) {
        dataToSave.floorPlan = { url: dataToSave.floorPlan.url, name: dataToSave.floorPlan.name };
      }
      localStorage.setItem("nirmix_property_draft", JSON.stringify(dataToSave));
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setDraftSavedAt(now);
    } catch (e) {
      console.error("Failed to save draft", e);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem("nirmix_property_draft");
    setDraftSavedAt(null);
  };

  const resetWizard = () => {
    setFormData(INITIAL_FORM_STATE);
    setActiveStep(0);
    setIsSuccess(false);
  };

  const handleFormChange = (updatedData: Partial<PropertyFormData>) => {
    const nextData = { ...formData, ...updatedData };
    setFormData(nextData);
    if (!isEditMode) saveDraft(nextData);
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.listingType) stepErrors.listingType = "Please select a listing type.";
      if (!formData.propertyType) stepErrors.propertyType = "Please select a property type.";
      if (!formData.title || formData.title.trim().length < 10) {
        stepErrors.title = "Title must be at least 10 characters long.";
      }
      if (!formData.description || formData.description.trim().length < 20) {
        stepErrors.description = "Description must be at least 20 characters long.";
      }
    }

    if (step === 1) {
      if (!formData.province) stepErrors.province = "Province is required.";
      if (!formData.district) stepErrors.district = "District is required.";
      if (!formData.city || !formData.city.trim()) stepErrors.city = "City / Municipality is required.";
      if (!formData.wardNo) stepErrors.wardNo = "Ward number is required.";
      if (!formData.area || !formData.area.trim()) stepErrors.area = "Area / Tole is required.";
    }

    if (step === 2) {
      if (formData.isDetailsValid === false) {
        stepErrors.details = "Please fill in all required fields.";
      }
    }

    if (step === 3) {
      if (!formData.photos || formData.photos.length === 0) {
        stepErrors.photos = "At least one property photo (cover image) is required.";
      }
    }

    if (step === 4) {
      if (!formData.termsAccepted) {
        stepErrors.termsAccepted = "You must agree to the terms to publish your property.";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < STEPS.length - 1) {
        setActiveStep((prev) => prev + 1);
      }
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleGoToStep = (stepIndex: number) => {
    if (stepIndex < activeStep || validateStep(activeStep)) {
      setActiveStep(stepIndex);
    }
  };

  const handlePublish = async () => {
    if (!validateStep(4)) {
      toast.error("Please accept the terms before publishing.");
      return;
    }

    if (!accessToken) {
      toast.error("Please log in to publish a listing.");
      return;
    }

    // New uploads carry a File; existing (server-stored) photos carry a publicId.
    const newPhotoFiles = formData.photos.filter((p) => p.file);
    const keptPhotos = formData.photos.filter((p) => !p.file && p.publicId);
    if (newPhotoFiles.length + keptPhotos.length === 0) {
      toast.error(
        isEditMode
          ? "Keep or add at least one property photo."
          : "Please re-upload your property photos before publishing."
      );
      setActiveStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = buildListingPayload(formData);

      if (isEditMode) {
        payload.existingPhotos = keptPhotos.map((p) => ({ url: p.url, publicId: p.publicId }));
        const fp = formData.floorPlan;
        payload.existingFloorPlan =
          fp && !fp.file && fp.publicId ? { url: fp.url, publicId: fp.publicId } : null;
      }

      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));
      newPhotoFiles.forEach((p) => fd.append("photos", p.file as File));
      if (formData.floorPlan?.file) {
        fd.append("floorPlan", formData.floorPlan.file);
      }

      const res = await apiFetch(
        isEditMode ? `${API_BASE}/properties/${editId}` : `${API_BASE}/properties`,
        {
          method: isEditMode ? "PATCH" : "POST",
          body: fd,
        }
      );
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "Failed to save listing. Please try again.");
        return;
      }

      setIsSuccess(true);
      if (!isEditMode) clearDraft();
      toast.success(
        isEditMode ? "Listing updated successfully!" : "Property listing published successfully!"
      );
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      clearDraft();
      resetWizard();
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepBasics
            formData={formData}
            onChange={handleFormChange}
            errors={errors}
            locked={isEditMode}
          />
        );
      case 1:
        return (
          <StepLocation
            formData={formData}
            onChange={handleFormChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <StepDetails
            formData={formData}
            onChange={handleFormChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <StepMedia
            formData={formData}
            onChange={handleFormChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <StepReview
            formData={formData}
            onGoToStep={handleGoToStep}
            errors={errors}
            onCheckboxChange={(checked) => handleFormChange({ termsAccepted: checked })}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  // Accent flips between sale (warm gold) and rent (green); engraved styles read these.
  const isRent = formData.listingType === "For Rent";
  const primaryTextClass = isRent ? "text-white" : "text-[#342417]";

  const getStepHeader = () => {
    switch (activeStep) {
      case 0:
        return {
          title: "Tell us about your property",
          desc: "A clear title and the right type help buyers find you faster.",
        };
      case 1:
        return {
          title: "Where is your property located?",
          desc: "Provide an accurate address to help buyers locate your property.",
        };
      case 2:
        const typeStr = formData.propertyType === "Apartment" ? "Apartment" : formData.propertyType === "House" ? "House" : formData.propertyType === "Land" ? "Land" : "Property";
        return {
          title: `${typeStr} details`,
          desc: "Provide specific parameters, specifications and pricing options.",
        };
      case 3:
        return {
          title: "Upload Property Photos",
          desc: "Add photos, video tours, and floor plans to stand out.",
        };
      case 4:
        return {
          title: "Review your listing",
          desc: "Verify your details before publishing to NirMix.",
        };
      default:
        return { title: "", desc: "" };
    }
  };

  const { title: stepTitle, desc: stepDesc } = getStepHeader();

  return (
    <div
      className="nm-board fixed inset-0 z-[100] w-full h-full flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none"
      style={{
        "--nm-accent": isRent ? "#3F8F4E" : "#B98A2E",
        "--nm-accent-soft": isRent ? "rgba(63,143,78,0.15)" : "rgba(185,138,46,0.18)",
        "--nm-accent-ring": isRent ? "rgba(63,143,78,0.28)" : "rgba(185,138,46,0.32)",
      } as React.CSSProperties}
    >
      {/* Soft vignette to draw the eye to the board centre */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(130%_110%_at_50%_-10%,transparent_55%,rgba(74,52,28,0.30))]" />

      {/* Tactile "paper board with engraved content" design system — shared by every step */}
      <style jsx global>{`
        /* Warm plaster wall: fine grain + coarse mottling, lit softly from the top */
        .nm-board {
          background-color: #E4D8C0;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.6'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.016' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)' opacity='0.55'/%3E%3C/svg%3E"),
            radial-gradient(130% 110% at 50% 0%, rgba(255,250,240,0.55), rgba(120,90,55,0.20));
          background-size: 180px 180px, 600px 600px, 100% 100%;
          background-blend-mode: soft-light, soft-light, normal;
        }
        .nm-recessed {
          background-color: #F4ECD9;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          border: 1px solid rgba(120,90,55,0.28);
          border-radius: 24px;
          box-shadow:
            inset 0 3px 8px rgba(90,66,38,0.20),
            inset 0 -1px 0 rgba(255,255,255,0.7),
            0 1px 0 rgba(255,255,255,0.5);
        }
        .nm-stepper {
          border-radius: 9999px;
          background-color: #E1CFAE;
          box-shadow:
            inset 0 2px 5px rgba(90,66,38,0.25),
            inset 0 -1px 0 rgba(255,255,255,0.55);
        }
        .nm-pip {
          background-color: #EBDDC0;
          box-shadow: inset 0 1px 3px rgba(90,66,38,0.25), inset 0 -1px 0 rgba(255,255,255,0.5);
        }
        .nm-track {
          background-color: #E1CFAE;
          box-shadow: inset 0 1px 2px rgba(90,66,38,0.30);
        }
        .nm-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: #5C4D3C;
          text-shadow: 0 1px 0 rgba(255,255,255,0.6);
          margin-bottom: 8px;
        }
        .nm-input {
          width: 100%;
          background-color: #ECE0C7;
          border: 1px solid rgba(120,90,55,0.22);
          border-radius: 12px;
          color: #342417;
          box-shadow: inset 0 2px 4px rgba(90,66,38,0.16), inset 0 -1px 0 rgba(255,255,255,0.55);
          transition: background-color .18s ease, border-color .18s ease, box-shadow .18s ease;
        }
        .nm-input::placeholder { color: rgba(52,36,23,0.40); }
        .nm-input:hover { background-color: #EFE6D1; }
        .nm-input:focus {
          outline: none;
          background-color: #FBF6EA;
          border-color: var(--nm-accent);
          box-shadow: inset 0 1px 2px rgba(90,66,38,0.10), 0 0 0 3px var(--nm-accent-ring);
        }
        .nm-input:disabled { opacity: .55; cursor: not-allowed; }
        .nm-tile {
          background-color: #EFE6CF;
          border: 1px solid rgba(120,90,55,0.20);
          border-radius: 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 2px rgba(90,66,38,0.08);
          transition: all .2s ease;
        }
        .nm-tile:hover { background-color: #F4EDDA; box-shadow: 0 5px 12px rgba(90,66,38,0.14); }
        .nm-tile.is-selected {
          background-color: var(--nm-accent-soft);
          border-color: var(--nm-accent);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 6px 14px rgba(90,66,38,0.20);
          transform: translateY(-1px);
        }
        .nm-chip {
          background-color: #EFE6CF;
          border: 1px solid rgba(120,90,55,0.20);
          border-radius: 9999px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
          transition: all .18s ease;
        }
        .nm-chip:hover { background-color: #F4EDDA; }
        .nm-chip.is-selected {
          background-color: var(--nm-accent-soft);
          border-color: var(--nm-accent);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 3px 8px rgba(90,66,38,0.16);
        }
        .nm-panel {
          background-color: #FBF6EA;
          border: 1px solid rgba(120,90,55,0.18);
          border-radius: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 6px rgba(90,66,38,0.07);
        }
        .nm-btn {
          border-radius: 12px;
          border: 1px solid rgba(120,90,55,0.18);
          transition: transform .12s ease, box-shadow .12s ease, background-color .15s ease, filter .15s ease;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.45), 0 3px 0 rgba(120,90,55,0.30), 0 6px 12px rgba(90,66,38,0.16);
        }
        .nm-btn:hover { filter: brightness(1.03); }
        .nm-btn:active {
          transform: translateY(2px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 0 rgba(120,90,55,0.30), 0 3px 6px rgba(90,66,38,0.12);
        }
        .nm-btn:disabled { transform: none; filter: none; }
        .nm-btn-primary { border-color: rgba(0,0,0,0.06); }
        .nm-btn-paper { background-color: #F1E7D2; }
        .nm-btn-amber { background-color: #EBC55A; }
        .nm-btn-danger {
          background-color: #E0573F;
          border-color: rgba(120,40,20,0.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 3px 0 rgba(150,40,20,0.35), 0 6px 12px rgba(150,40,20,0.20);
        }
        .nm-btn-dark {
          background-color: #3A2A1A;
          border-color: rgba(0,0,0,0.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 3px 0 rgba(20,12,6,0.5), 0 6px 12px rgba(20,12,6,0.25);
        }
      `}</style>

      <div className="relative z-10 w-full min-w-0 max-w-[1300px] h-full max-h-[85vh] md:max-h-[88vh] flex flex-col justify-between">
        {/* Desktop-only Header Section */}
        <div className="max-lg:hidden lg:flex justify-between items-start gap-4 mb-6 shrink-0 pl-0">
          {/* Left: Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[2.5px] w-6 bg-[#C5A880]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C5A880]">
                LIST YOUR PROPERTY
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-[#342417] tracking-tight">
              Post a Property
            </h1>
            <p className="text-sm text-[#5C4D3C]/70 mt-2 font-semibold leading-relaxed">
              Step-by-step listing. You can save and resume any time.
            </p>
          </div>

          {/* Right: Logo Container (perfectly aligned with right column) */}
          <div className="w-44 shrink-0 flex justify-end">
            <img
              src="/images/NirMix_Logo.png"
              alt="NirMix Logo"
              className="w-44 h-auto object-contain"
            />
          </div>
        </div>

        {/* Horizontal columns container */}
        <div className="flex-1 min-h-0 min-w-0 flex flex-col lg:flex-row items-stretch justify-between gap-4 sm:gap-6">
          {/* Left Column: Back navigation (Desktop only) */}
          <div className="max-lg:hidden lg:flex w-32 shrink-0 flex-col justify-end pb-3">
            {!isSuccess && activeStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="nm-btn nm-btn-paper w-full flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-[#342417] cursor-pointer"
              >
                ← Back
              </button>
            ) : (
              <div className="h-10" />
            )}
          </div>

          {/* Middle Column: Title, Stepper, and Card */}
          <div className="flex-1 min-w-0 h-full flex flex-col min-h-0 justify-start w-full">
            {/* Top Header Row on Mobile: Logo, Title, and top buttons */}
            <div className="lg:hidden shrink-0 flex flex-col gap-3 mb-3 px-2">
              <div className="flex justify-between items-center gap-4">
                <img
                  src="/images/NirMix_Logo.png"
                  alt="NirMix Logo"
                  className="w-28 h-auto object-contain"
                />
                {/* Compact Mobile Draft/Cancel Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      saveDraft(formData);
                      toast.success("Draft saved successfully.");
                      onClose();
                    }}
                    className="nm-btn nm-btn-amber px-3 py-1.5 text-[#342417] text-[10px] font-bold cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="nm-btn nm-btn-danger px-3 py-1.5 text-white text-[10px] font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-[2px] w-5 bg-[#C5A880]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C5A880]">
                    LIST YOUR PROPERTY
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#342417] tracking-tight">
                  Post a Property
                </h1>
              </div>
            </div>

            {/* Stepper progress indicator */}
            <div className="mb-3 shrink-0 flex justify-start pl-2 max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="nm-stepper flex items-center gap-1.5 sm:gap-6 px-4 py-2 whitespace-nowrap">
                {STEPS.map((step, index) => {
                  const isCompleted = activeStep > index;
                  const isActive = activeStep === index;
                  return (
                    <div key={step.label} className="flex items-center">
                      {index > 0 && (
                        <div className={`w-3 sm:w-6 h-[1.5px] mx-1 sm:mx-1.5 ${isCompleted ? "bg-[#27AE60]" : "bg-[#5C4D3C]/20"}`} />
                      )}
                      <button
                        type="button"
                        onClick={() => handleGoToStep(index)}
                        className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
                      >
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-extrabold transition-all duration-300 ${isCompleted
                            ? "bg-[#27AE60] text-white shadow-[0_2px_4px_rgba(39,174,96,0.35)]"
                            : isActive
                              ? "text-[#342417] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_8px_rgba(90,66,38,0.25)]"
                              : "nm-pip text-[#5C4D3C]/60"
                            }`}
                          style={isActive ? { backgroundColor: "var(--nm-accent)" } : undefined}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-extrabold tracking-wide transition-colors ${isActive ? "text-[#342417]" : "text-[#342417]/45"
                          }`}>
                          {step.label}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Card Container */}
            <div className="nm-recessed flex-1 min-h-0 p-4 sm:p-6 flex flex-col relative overflow-hidden mb-2 md:mb-3">
              {isSuccess ? (
                <div className="text-center flex flex-col items-center justify-center py-6 sm:py-8 flex-1">
                  <div className="p-3 sm:p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-4 sm:mb-6 animate-bounce">
                    <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#342417] tracking-tight mb-2 sm:mb-3">
                    {isEditMode ? "Property Updated Successfully!" : "Property Listed Successfully!"}
                  </h2>

                  <p className="text-sm sm:text-base text-[#342417]/70 max-w-md mb-6 sm:mb-8 leading-relaxed font-medium">
                    Your listing <span className="font-bold text-[#342417]">&quot;{formData.title}&quot;</span>{" "}
                    {isEditMode
                      ? "has been updated. Your changes are now live."
                      : "is now live. Buyers and renters can discover and view your listing details."}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
                    {isEditMode ? (
                      <button
                        onClick={() => {
                          resetWizard();
                          router.push("/dashboard/my-listings");
                        }}
                        className="nm-btn nm-btn-dark px-6 py-3 text-white text-xs sm:text-sm font-bold cursor-pointer flex items-center justify-center gap-2"
                      >
                        Go to My Listings
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            resetWizard();
                            onClose();
                          }}
                          className="nm-btn nm-btn-dark px-6 py-3 text-white text-xs sm:text-sm font-bold cursor-pointer flex items-center justify-center gap-2"
                        >
                          Go to Dashboard
                        </button>

                        <button
                          onClick={() => {
                            resetWizard();
                          }}
                          className="nm-btn nm-btn-paper px-6 py-3 text-xs sm:text-sm font-bold text-[#342417] cursor-pointer flex items-center justify-center gap-2"
                        >
                          Post Another Property
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Step Sub-Header inside Card */}
                  <div className="border-b border-[#A57C52]/30 pb-3 mb-4 sm:mb-5 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-[#342417]">
                        {stepTitle}
                      </h2>
                      {stepDesc && (
                        <p className="text-[11px] sm:text-xs text-[#5C4D3C]/75 mt-0.5 font-medium">
                          {stepDesc}
                        </p>
                      )}
                    </div>
                    {/* Completion bar aligned horizontally */}
                    {activeStep === 2 && formData.detailsCompletion !== undefined && (
                      <div className="nm-chip flex items-center gap-2 px-3 py-1 shrink-0 self-start sm:self-auto">
                        <span className="text-[9px] text-[#5C4D3C] font-extrabold uppercase tracking-wider">Completion:</span>
                        <div className="nm-track w-16 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${formData.detailsCompletion === 100
                              ? "bg-emerald-500"
                              : formData.listingType === "For Rent"
                                ? "bg-[#24A148]"
                                : "bg-[#E5C158]"
                              }`}
                            style={{ width: `${formData.detailsCompletion || 0}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-[#342417]">{formData.detailsCompletion || 0}%</span>
                      </div>
                    )}
                  </div>

                  {/* Scrollable inner content */}
                  <div className="flex-1 overflow-y-auto pr-1">
                    {renderStepContent()}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation (visible only on mobile/tablet) */}
            <div className="flex justify-between items-center gap-3 mt-1 mb-2 lg:hidden shrink-0">
              {/* Back Button */}
              {!isSuccess && activeStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="nm-btn nm-btn-paper flex-1 py-2.5 text-xs font-bold text-[#342417] cursor-pointer text-center"
                >
                  ← Back
                </button>
              ) : (
                <div className="flex-1" />
              )}

              {/* Continue / Publish Button */}
              {!isSuccess && (
                activeStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={activeStep === 2 && formData.isDetailsValid === false}
                    style={{ backgroundColor: "var(--nm-accent)" }}
                    className={`nm-btn nm-btn-primary flex-1 py-2.5 ${primaryTextClass} text-xs font-bold cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    style={{ backgroundColor: "var(--nm-accent)" }}
                    className={`nm-btn nm-btn-primary flex-1 py-2.5 ${primaryTextClass} text-xs font-extrabold cursor-pointer disabled:opacity-75 text-center flex items-center justify-center gap-1.5`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className={`h-3 w-3 animate-spin ${primaryTextClass}`} />
                        {isEditMode ? "Saving..." : "Publishing..."}
                      </>
                    ) : (
                      <>{isEditMode ? "Save Changes" : "Publish"}</>
                    )}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Right Column: Draft/Cancel, and Continue (Desktop only) */}
          <div className="max-lg:hidden lg:flex w-44 shrink-0 flex-col justify-between items-end pb-3">
            <div className="flex flex-col items-end gap-3 w-full">
              {/* Draft & Cancel Actions (Stacked Vertically) */}
              <div className="flex flex-col gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => {
                    saveDraft(formData);
                    toast.success("Draft saved successfully.");
                    onClose();
                  }}
                  className="nm-btn nm-btn-amber w-full px-5 py-2.5 text-[#342417] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Save as Draft →
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="nm-btn nm-btn-danger w-full px-5 py-2.5 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Cancel ☒
                </button>
              </div>
            </div>

            {/* Continue / Publish Action */}
            <div className="w-full">
              {!isSuccess && (
                activeStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={activeStep === 2 && formData.isDetailsValid === false}
                    style={{ backgroundColor: "var(--nm-accent)" }}
                    className={`nm-btn nm-btn-primary w-full flex items-center justify-center gap-1.5 px-6 py-2.5 ${primaryTextClass} text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    style={{ backgroundColor: "var(--nm-accent)" }}
                    className={`nm-btn nm-btn-primary w-full flex items-center justify-center gap-1.5 px-6 py-2.5 ${primaryTextClass} text-xs font-extrabold cursor-pointer disabled:opacity-75`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className={`h-3.5 w-3.5 animate-spin ${primaryTextClass}`} />
                        {isEditMode ? "Saving..." : "Publishing..."}
                      </>
                    ) : (
                      <>{isEditMode ? "Save Changes" : "Publish"}</>
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
