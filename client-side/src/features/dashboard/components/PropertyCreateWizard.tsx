"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, FileCheck, CheckCircle2, ArrowRight, Loader2, Home, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { StepBasics } from "./create-steps/StepBasics";
import { StepLocation } from "./create-steps/StepLocation";
import { StepDetails } from "./create-steps/StepDetails";
import { StepMedia } from "./create-steps/StepMedia";
import { StepReview } from "./create-steps/StepReview";

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

const sanitizeData = (data: any) => {
  if (!data || typeof data !== "object") return INITIAL_FORM_STATE;

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
    zoning: typeof data.zoning === "string" ? data.zoning : "",
    roadSize: typeof data.roadSize === "string" || typeof data.roadSize === "number" ? String(data.roadSize) : "",
    frontage: typeof data.frontage === "string" || typeof data.frontage === "number" ? String(data.frontage) : "",
    roadType: typeof data.roadType === "string" ? data.roadType : "",
    pricePerUnit: typeof data.pricePerUnit === "string" || typeof data.pricePerUnit === "number" ? String(data.pricePerUnit) : "",
    floorLevel: typeof data.floorLevel === "string" || typeof data.floorLevel === "number" ? String(data.floorLevel) : "",
    sharedFacilities: Array.isArray(data.sharedFacilities) ? data.sharedFacilities : [],
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    photos: Array.isArray(data.photos) ? data.photos.filter((p: any) => p && typeof p.url === "string") : [],
    videoLink: typeof data.videoLink === "string" ? data.videoLink : "",
    floorPlan: data.floorPlan && typeof data.floorPlan.url === "string" ? data.floorPlan : null,
    termsAccepted: !!data.termsAccepted,
  };
};

interface PropertyCreateWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyCreateWizard({ isOpen, onClose }: PropertyCreateWizardProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem("nirmix_property_draft");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          const sanitized = sanitizeData(parsed);
          setFormData(sanitized);
          toast.info("Restored property draft.");
        } catch (e) {
          console.error("Failed to restore draft", e);
        }
      }
    }
  }, [isOpen]);

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

  const saveDraft = (data: any) => {
    try {
      const dataToSave = { ...data };
      if (dataToSave.photos) {
        dataToSave.photos = dataToSave.photos.map((p: any) => ({ url: p.url, name: p.name }));
      }
      if (dataToSave.floorPlan) {
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

  const handleFormChange = (updatedData: any) => {
    const nextData = { ...formData, ...updatedData };
    setFormData(nextData);
    saveDraft(nextData);
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
      if (!formData.price || Number(formData.price) <= 0) {
        stepErrors.price = "A valid positive price is required.";
      }

      if (formData.propertyType === "House" || formData.propertyType === "Apartment") {
        if (!formData.beds || Number(formData.beds) <= 0) {
          stepErrors.beds = "Number of bedrooms is required.";
        }
        if (!formData.baths || Number(formData.baths) <= 0) {
          stepErrors.baths = "Number of bathrooms is required.";
        }
        if (!formData.builtUpArea || Number(formData.builtUpArea) <= 0) {
          stepErrors.builtUpArea = "Built-up area is required.";
        }
      }

      if (formData.propertyType === "Land") {
        if (!formData.landArea || Number(formData.landArea) <= 0) {
          stepErrors.landArea = "Land area (Aana) is required.";
        }
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

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);
    clearDraft();
    toast.success("Property listing published successfully!");
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

  const getBackgroundImage = () => {
    if (formData.propertyType === "Apartment") {
      return "/images/hero-house.png";
    }
    if (formData.propertyType === "Land") {
      return "/images/land-bg.jpg";
    }
    return "/images/about-house.png";
  };

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
    <div className="fixed inset-0 z-[100] w-full h-full flex items-center justify-center bg-[#EAE2D8]/30 backdrop-blur-md p-3 sm:p-6 overflow-hidden select-none">
      {/* Fixed background image - does not scroll */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 filter blur-[6px] opacity-45"
        style={{ backgroundImage: `url('${getBackgroundImage()}')` }}
      />
      {/* Light beige warm tint overlay */}
      <div className="absolute inset-0 z-0 bg-[#FAF7F2]/40 mix-blend-multiply pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1300px] h-full max-h-[85vh] md:max-h-[88vh] flex flex-col justify-between">
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
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row items-stretch justify-between gap-4 sm:gap-6">
          {/* Left Column: Back navigation (Desktop only) */}
          <div className="max-lg:hidden lg:flex w-32 shrink-0 flex-col justify-end pb-3">
            {!isSuccess && activeStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#E5C158]/55 hover:bg-[#E5C158]/70 border border-[#A57C52]/30 text-xs font-bold text-[#342417] rounded-xl transition-all cursor-pointer shadow-md"
              >
                ← Back
              </button>
            ) : (
              <div className="h-10" />
            )}
          </div>

          {/* Middle Column: Title, Stepper, and Card */}
          <div className="flex-1 h-full flex flex-col min-h-0 justify-start w-full">
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
                    className="px-3 py-1.5 bg-[#F2C94C] hover:bg-[#E5C158] text-[#342417] text-[10px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-[10px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
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
              <div className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-full bg-[#854A22]/45 border border-[#A57C52]/20 backdrop-blur-md whitespace-nowrap">
                {STEPS.map((step, index) => {
                  const isCompleted = activeStep > index;
                  const isActive = activeStep === index;
                  return (
                    <div key={step.label} className="flex items-center">
                      {index > 0 && (
                        <div className={`w-3 sm:w-6 h-[1.5px] mx-1 sm:mx-1.5 ${isCompleted ? "bg-[#E5C158]" : "bg-[#342417]/20"}`} />
                      )}
                      <button
                        type="button"
                        onClick={() => handleGoToStep(index)}
                        className="flex items-center gap-1 cursor-pointer focus:outline-none"
                      >
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-extrabold transition-all duration-300 ${isCompleted
                          ? "bg-[#27AE60] text-white"
                          : isActive
                            ? "bg-[#E5C158] text-[#342417] ring-2 ring-[#E5C158]/20"
                            : "bg-white/40 text-[#342417]/60"
                        }`}>
                          {isCompleted ? "✓" : index + 1}
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-extrabold tracking-wide transition-colors ${isActive ? "text-[#342417]" : "text-[#342417]/50"
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
            <div className="flex-1 min-h-0 bg-[#EADDC9]/60 backdrop-blur-xl border-2 border-[#A57C52]/50 shadow-2xl p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] flex flex-col relative overflow-hidden mb-2 md:mb-3">
              {isSuccess ? (
                <div className="text-center flex flex-col items-center justify-center py-6 sm:py-8 flex-1">
                  <div className="p-3 sm:p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-4 sm:mb-6 animate-bounce">
                    <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#342417] tracking-tight mb-2 sm:mb-3">
                    Property Listed Successfully!
                  </h2>

                  <p className="text-sm sm:text-base text-[#342417]/70 max-w-md mb-6 sm:mb-8 leading-relaxed font-medium">
                    Your listing <span className="font-bold text-[#342417]">"{formData.title}"</span> is now live. Buyers and renters can discover and view your listing details.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
                    <button
                      onClick={() => {
                        resetWizard();
                        onClose();
                      }}
                      className="px-6 py-3 bg-[#342417] text-white hover:bg-[#251910] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      Go to Dashboard
                    </button>

                    <button
                      onClick={() => {
                        resetWizard();
                      }}
                      className="px-6 py-3 bg-white border border-[#E0D4C5] hover:bg-[#F5EFE6] text-xs sm:text-sm font-bold text-[#342417] rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      Post Another Property
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Step Sub-Header inside Card */}
                  <div className="border-b border-[#A57C52]/30 pb-3 mb-4 sm:mb-5 shrink-0">
                    <h2 className="text-base sm:text-lg font-extrabold text-[#342417]">
                      {stepTitle}
                    </h2>
                    {stepDesc && (
                      <p className="text-[11px] sm:text-xs text-[#5C4D3C]/75 mt-0.5 font-medium">
                        {stepDesc}
                      </p>
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
                  className="flex-1 py-2.5 bg-[#E5C158]/55 hover:bg-[#E5C158]/70 border border-[#A57C52]/30 text-xs font-bold text-[#342417] rounded-xl transition-all cursor-pointer shadow-md text-center"
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
                    className="flex-1 py-2.5 bg-[#E5C158] hover:bg-[#C29624] text-[#342417] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md text-center"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-[#E5C158] hover:bg-[#C29624] text-[#342417] text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-75 text-center flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-[#342417]" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        Continue →
                      </>
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
                  className="w-full px-5 py-2.5 bg-[#F2C94C] hover:bg-[#E5C158] text-[#342417] text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Save as Draft →
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-fit px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(239,68,68,0.35)] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Cancel ☒
                </button>
              </div>
            </div>

            {/* Continue / Publish Action */}
            <div className="w-fit">
              {!isSuccess && (
                activeStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#E5C158] hover:bg-[#C29624] text-[#342417] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#E5C158] hover:bg-[#C29624] text-[#342417] text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#342417]" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        Continue →
                      </>
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
