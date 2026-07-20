"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useSaved } from "@/lib/saved-context";
import { useAuth } from "@/lib/auth-context";
import { scheduleVisit } from "@/lib/visit-api";
import {
  fetchPropertyReviews,
  submitReview,
  deleteReview,
  type ApiReview,
  type ReviewSummary,
} from "@/lib/review-api";
import { OwnerVisitRequests } from "./components/OwnerVisitRequests";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Home,
  Building2,
  Map as MapIcon,
  ChevronRight,
  Share2,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageCircle,
  CalendarDays,
  Clock,
  Star,
  Sparkles,
  Check,
  User,
  Briefcase,
  Tag,
  Play,
  FileText,
  ExternalLink,
  Navigation,
  Send,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";
import type { Property, Lister, PropertyType } from "@/types/property";

// Leaflet touches `window`, so the map must never render during SSR.
const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center text-xs font-semibold text-[#5C4D3C]/60">
      Loading map…
    </div>
  ),
});

interface PropertyDetailPageProps {
  property: Property;
  /** Optional contextual back link (e.g. when arriving from the dashboard). */
  backTo?: { href: string; label: string };
}

const TYPE_ICON: Record<PropertyType, typeof Home> = {
  House: Home,
  Apartment: Building2,
  Land: MapIcon,
};

const TIME_SLOTS = ["09:00 – 11:00", "11:00 – 13:00", "13:00 – 15:00", "15:00 – 17:00", "17:00 – 19:00"];

function formatPrice(price: number, status: Property["status"]): string {
  if (status === "For Rent") return `NPR ${price.toLocaleString("en-IN")}/mo`;
  if (price >= 1e7) return `NPR ${(price / 1e7).toFixed(price % 1e7 === 0 ? 0 : 2)} Cr`;
  if (price >= 1e5) return `NPR ${(price / 1e5).toFixed(price % 1e5 === 0 ? 0 : 2)} Lakh`;
  return `NPR ${price.toLocaleString("en-IN")}`;
}

function areaLabel(p: Property): string {
  return p.areaUnit === "Aana" ? `${p.areaSqft} Aana` : `${p.areaSqft.toLocaleString()} sqft`;
}

// Fallback specs for listings that don't carry an explicit `specs` array.
function buildSpecs(p: Property): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [
    { label: "Property type", value: p.type },
    { label: "Listing", value: p.status },
  ];
  if (p.type !== "Land") {
    rows.push({ label: "Bedrooms", value: String(p.beds) });
    rows.push({ label: "Bathrooms", value: String(p.baths) });
  }
  rows.push({ label: "Area", value: areaLabel(p) });
  return rows;
}

// Convert a YouTube/Vimeo watch link to an embeddable URL (null if not embeddable).
function getVideoEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/")) return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

const LISTER_BADGE: Record<Lister["type"], { icon: typeof User; tint: string }> = {
  Personal: { icon: User, tint: "#157A74" },
  Agent: { icon: Briefcase, tint: "#B05B33" },
  Builder: { icon: Home, tint: "#7A5418" },
};

/** Display name for a review's author (populated by the API). */
const authorName = (r: ApiReview): string =>
  typeof r.author === "object" ? r.author.displayName || r.author.name : "NirMix User";

// Row of 5 stars; pass a fractional value to fill proportionally.
function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative inline-block">
            <Star className={`${size} text-[#E0D4C5]`} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={`${size} fill-[#E5A93A] text-[#E5A93A]`} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function PropertyDetailPage({ property, backTo }: PropertyDetailPageProps) {
  const accent = property.status === "For Rent" ? "#157A74" : "#B05B33";
  const TypeIcon = TYPE_ICON[property.type] ?? Home;

  const lister: Lister =
    property.listedBy ?? {
      type: "Agent",
      name: property.agent.name,
      company: property.agent.company,
      verified: true,
    };
  const ListerIcon = LISTER_BADGE[lister.type].icon;

  const specs = property.specs ?? buildSpecs(property);
  const amenities = property.amenities ?? [];
  const highlights = property.highlights ?? [];

  const [activePhoto, setActivePhoto] = useState(0);
  const { isSaved, toggleSave } = useSaved();
  const saved = isSaved(property.id);
  const { user, isLoading: authLoading } = useAuth();
  const isOwner = !!user && !!property.ownerId && user.id === property.ownerId;

  // Schedule-visit form
  const [visit, setVisit] = useState({ date: "", slot: "", name: "", phone: "" });
  const [visitBooked, setVisitBooked] = useState(false);
  const [submittingVisit, setSubmittingVisit] = useState(false);

  const submitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOwner) return; // owners manage requests, they don't book their own visits
    if (!visit.date || !visit.slot || !visit.name.trim() || !visit.phone.trim()) {
      toast.error("Please fill in date, time, name and phone.");
      return;
    }
    setSubmittingVisit(true);
    try {
      await scheduleVisit({
        propertyId: property.id,
        date: visit.date,
        slot: visit.slot,
        name: visit.name.trim(),
        phone: visit.phone.trim(),
      });
      setVisitBooked(true);
      toast.success("Visit requested! The lister will confirm shortly.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t request the visit. Please try again.");
    } finally {
      setSubmittingVisit(false);
    }
  };

  // Reviews — loaded from the API; the author comes from the signed-in user.
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({ average: 0, count: 0, buckets: {} });
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadReviews = useCallback(async () => {
    const data = await fetchPropertyReviews(property.id);
    setReviews(data.reviews);
    setSummary(data.summary);
  }, [property.id]);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetchPropertyReviews(property.id);
      if (!active) return;
      setReviews(data.reviews);
      setSummary(data.summary);
    })();
    return () => {
      active = false;
    };
  }, [property.id]);

  // The caller's own review, if any — submitting again updates it (server upserts).
  const myReview = user
    ? reviews.find((r) => typeof r.author === "object" && r.author._id === user.id)
    : undefined;

  const ratingBuckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: summary.buckets?.[String(star)] ?? 0,
  }));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to write a review.");
    if (reviewForm.rating === 0) return toast.error("Please pick a star rating.");
    if (!reviewForm.comment.trim()) return toast.error("Please write a short review.");

    setSubmittingReview(true);
    try {
      await submitReview({
        propertyId: property.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      setReviewForm({ rating: 0, comment: "" });
      setHoverRating(0);
      await loadReviews();
      toast.success(myReview ? "Your review has been updated." : "Thanks! Your review has been posted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t post your review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id);
      await loadReviews();
      toast.success("Your review has been removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t delete the review.");
    }
  };

  const initials = lister.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const fullAddress = [property.location.neighborhood, property.location.city, property.location.district]
    .filter(Boolean)
    .join(", ");

  const videoEmbed = property.videoLink ? getVideoEmbed(property.videoLink) : null;
  const mapQuery = property.coordinates
    ? `${property.coordinates.lat},${property.coordinates.lng}`
    : `${fullAddress}, Nepal`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const isPdfPlan = !!property.floorPlan && /\.pdf($|\?)/i.test(property.floorPlan.url);

  const fieldCls =
    "w-full rounded-xl border border-mist bg-sand/40 px-3 py-2.5 text-sm font-medium text-[#342417] placeholder-[#5C4D3C]/40 outline-none transition focus:border-[#342417]/30 focus:bg-white";

  return (
    <div className="relative flex min-h-screen flex-col font-sans selection:bg-ember/20 selection:text-ember">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* Contextual back (e.g. from the dashboard) */}
        {backTo && (
          <Link
            href={backTo.href}
            className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-mist bg-white px-3 py-1.5 text-xs font-bold text-[#342417] shadow-sm transition hover:-translate-x-0.5 hover:border-[#342417]/25"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            {backTo.label}
          </Link>
        )}

        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-[#5C4D3C]/70">
          <Link href="/" className="hover:text-[#342417] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={property.status === "For Rent" ? "/rent" : "/buy"}
            className="hover:text-[#342417] transition-colors"
          >
            {property.status === "For Rent" ? "Rent" : "Buy"}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-[#342417]">{property.title}</span>
        </nav>

        {/* Gallery */}
        <section className="relative overflow-hidden rounded-3xl border border-mist bg-white shadow-[0_18px_50px_-24px_rgba(52,36,23,0.4)]">
          <div className="relative h-[300px] w-full sm:h-[440px]">
            <Image
              src={property.photos[activePhoto] ?? property.photos[0]}
              alt={property.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span
                className="rounded-lg px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-sm"
                style={{ backgroundColor: accent }}
              >
                {property.status === "For Rent" ? "For Rent" : "For Sale"}
              </span>
              {property.tag && (
                <span className="flex items-center gap-1 rounded-lg bg-[#342417]/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm">
                  <Tag className="h-3 w-3" />
                  {property.tag}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="absolute right-4 top-4 flex gap-2">
              <button
                type="button"
                onClick={() => toggleSave(property)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#342417] shadow-sm backdrop-blur-sm transition hover:bg-white cursor-pointer"
                aria-label={saved ? "Remove from saved" : "Save property"}
                aria-pressed={saved}
              >
                <Heart className={`h-4.5 w-4.5 transition-transform ${saved ? "scale-110 fill-red-500 text-red-500" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(typeof window !== "undefined" ? window.location.href : "");
                  toast.success("Link copied to clipboard.");
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#342417] shadow-sm backdrop-blur-sm transition hover:bg-white cursor-pointer"
                aria-label="Share property"
              >
                <Share2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Thumbnails (when multiple photos) */}
          {property.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {property.photos.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  style={i === activePhoto ? { borderColor: accent } : undefined}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === activePhoto ? "" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Body grid */}
        <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          {/* ── Left: details ── */}
          <div className="min-w-0 space-y-6">
            {/* Title + price */}
            <div className="rounded-2xl border border-mist bg-white/85 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide" style={{ color: accent }}>
                    <TypeIcon className="h-4 w-4" />
                    {property.type}
                  </div>
                  <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#342417] sm:text-3xl">
                    {property.title}
                  </h1>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-[#5C4D3C]/80">
                    <MapPin className="h-4 w-4 shrink-0" style={{ color: accent }} />
                    {fullAddress}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-extrabold text-[#342417] sm:text-[28px]">
                    {formatPrice(property.price, property.status)}
                  </p>
                  {property.postedOn && (
                    <p className="mt-1 text-[11px] text-[#5C4D3C]/55">
                      Posted {new Date(property.postedOn).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>

              {/* Key facts */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {property.type !== "Land" && (
                  <Fact icon={BedDouble} label="Bedrooms" value={String(property.beds)} accent={accent} />
                )}
                {property.type !== "Land" && (
                  <Fact icon={Bath} label="Bathrooms" value={String(property.baths)} accent={accent} />
                )}
                <Fact icon={Maximize2} label="Area" value={areaLabel(property)} accent={accent} />
                <Fact icon={TypeIcon} label="Type" value={property.type} accent={accent} />
              </div>
            </div>

            {/* Description */}
            <Card title="Description">
              <p className="text-sm leading-relaxed text-[#5C4D3C]">{property.description}</p>
            </Card>

            {/* Highlights */}
            {highlights.length > 0 && (
              <Card title="Highlights" icon={Sparkles} accent={accent}>
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-[#342417]">
                      <Star className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Property details / specs */}
            <Card title="Property details">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
                {specs.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between gap-4 border-b border-mist/70 py-3 ${
                      i === specs.length - 1 ? "border-b-0 sm:border-b" : ""
                    }`}
                  >
                    <dt className="text-xs font-bold text-[#5C4D3C]/60">{s.label}</dt>
                    <dd className="text-sm font-bold text-[#342417]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card title="Amenities & features">
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 rounded-xl border border-mist bg-sand/30 px-3 py-2.5 text-xs font-semibold text-[#342417]">
                      <Check className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                      {a}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Video tour */}
            {property.videoLink && (
              <Card title="Video tour" icon={Play} accent={accent}>
                {videoEmbed ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-mist bg-black">
                    <iframe
                      src={videoEmbed}
                      title="Property video tour"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={property.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-mist bg-sand/40 px-4 py-3 text-sm font-bold text-[#342417] transition hover:border-[#342417]/25"
                  >
                    <Play className="h-4 w-4" style={{ color: accent }} />
                    Watch video tour
                    <ExternalLink className="h-3.5 w-3.5 text-[#5C4D3C]/50" />
                  </a>
                )}
              </Card>
            )}

            {/* Floor plan */}
            {property.floorPlan && (
              <Card title="Floor plan" icon={FileText} accent={accent}>
                {isPdfPlan ? (
                  <a
                    href={property.floorPlan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-mist bg-sand/40 px-4 py-3.5 transition hover:border-[#342417]/25"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}1a`, color: accent }}>
                        <FileText className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-bold text-[#342417]">{property.floorPlan.name ?? "Floor plan.pdf"}</span>
                    </span>
                    <ExternalLink className="h-4 w-4 text-[#5C4D3C]/50" />
                  </a>
                ) : (
                  <a
                    href={property.floorPlan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-2xl border border-mist"
                  >
                    <div className="relative h-64 w-full bg-[#F5EFE6]">
                      <Image
                        src={property.floorPlan.url}
                        alt="Floor plan"
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </div>
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-[#342417]/85 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
                      <Maximize2 className="h-3.5 w-3.5" />
                      View full size
                    </span>
                  </a>
                )}
              </Card>
            )}

            {/* Location */}
            <Card title="Location" icon={MapPin} accent={accent}>
              <p className="text-sm font-semibold text-[#342417]">{fullAddress}</p>
              {(property.wardNo || property.landmark) && (
                <p className="mt-1 text-xs text-[#5C4D3C]/70">
                  {property.wardNo ? `Ward ${property.wardNo}` : ""}
                  {property.wardNo && property.landmark ? " · " : ""}
                  {property.landmark ?? ""}
                </p>
              )}

              {property.coordinates ? (
                <div className="mt-3 overflow-hidden rounded-2xl border border-mist">
                  <PropertyMap
                    center={property.coordinates}
                    color={accent}
                    className="h-64 w-full"
                    popup={<span className="text-xs font-semibold text-[#342417]">{fullAddress}</span>}
                  />
                </div>
              ) : (
                <div className="mt-3 flex h-32 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-mist bg-[#FBF7EF] text-center">
                  <MapPin className="h-5 w-5 text-[#5C4D3C]/50" />
                  <p className="text-xs font-semibold text-[#5C4D3C]/70">Exact location not pinned</p>
                  <p className="text-[11px] text-[#5C4D3C]/50">Use the button below to find the address on Google Maps.</p>
                </div>
              )}

              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 cursor-pointer"
                style={{ backgroundColor: accent }}
              >
                <Navigation className="h-4 w-4" />
                Open in Google Maps
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>
            </Card>

            {/* Reviews */}
            <Card title="Reviews" icon={MessageSquare} accent={accent}>
              {/* Summary */}
              <div className="flex flex-col gap-5 border-b border-mist pb-6 sm:flex-row sm:items-center">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FBF7EF] px-6 py-4 sm:w-44">
                  <span className="text-4xl font-extrabold leading-none text-[#342417]">{summary.average.toFixed(1)}</span>
                  <div className="mt-2">
                    <Stars value={summary.average} />
                  </div>
                  <span className="mt-1.5 text-[11px] font-semibold text-[#5C4D3C]/60">
                    {summary.count} review{summary.count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex-1 space-y-1.5">
                  {ratingBuckets.map((b) => {
                    const pct = summary.count ? (b.count / summary.count) * 100 : 0;
                    return (
                      <div key={b.star} className="flex items-center gap-2">
                        <span className="flex w-9 items-center gap-0.5 text-[11px] font-bold text-[#5C4D3C]/70">
                          {b.star}
                          <Star className="h-3 w-3 fill-[#E5A93A] text-[#E5A93A]" />
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EFE7D8]">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: "#E5A93A" }} />
                        </div>
                        <span className="w-6 text-right text-[11px] font-semibold text-[#5C4D3C]/55">{b.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write a review — sign-in required; owners can't review their own listing */}
              {authLoading ? null : isOwner ? (
                <p className="border-b border-mist py-6 text-sm text-[#5C4D3C]/70">
                  You can’t review your own listing.
                </p>
              ) : !user ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist py-6">
                  <p className="text-sm text-[#5C4D3C]/70">
                    Log in to share your experience with this property.
                  </p>
                  <Link
                    href="/login"
                    style={{ backgroundColor: accent }}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105"
                  >
                    Log in to review
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="border-b border-mist py-6">
                  <p className="mb-3 text-sm font-extrabold text-[#342417]">
                    {myReview ? "Update your review" : "Write a review"}
                  </p>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-xs font-bold text-[#5C4D3C]/70">Your rating</span>
                    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((i) => {
                        const filled = i <= (hoverRating || reviewForm.rating);
                        return (
                          <button
                            key={i}
                            type="button"
                            onMouseEnter={() => setHoverRating(i)}
                            onClick={() => setReviewForm((f) => ({ ...f, rating: i }))}
                            className="cursor-pointer transition-transform hover:scale-110"
                            aria-label={`${i} star${i > 1 ? "s" : ""}`}
                          >
                            <Star className={`h-6 w-6 ${filled ? "fill-[#E5A93A] text-[#E5A93A]" : "text-[#E0D4C5]"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with this property…"
                    className={`${fieldCls} resize-none`}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      style={{ backgroundColor: accent }}
                      className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      {submittingReview ? "Posting…" : myReview ? "Update review" : "Post review"}
                    </button>
                  </div>
                </form>
              )}

              {/* List */}
              <div className="divide-y divide-mist">
                {reviews.length === 0 && (
                  <p className="py-6 text-sm text-[#5C4D3C]/60">
                    No reviews yet — be the first to share your experience.
                  </p>
                )}
                {reviews.map((r) => {
                  const name = authorName(r);
                  const isMine = myReview?._id === r._id;
                  return (
                    <div key={r._id} className="flex gap-3 py-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#342417] text-xs font-extrabold text-white">
                        {name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-bold text-[#342417]">
                            {name}
                            {isMine && (
                              <span className="ml-2 rounded-md bg-[#FBF7EF] px-1.5 py-0.5 text-[10px] font-bold text-[#5C4D3C]/70">
                                You
                              </span>
                            )}
                          </p>
                          <span className="text-[11px] text-[#5C4D3C]/55">
                            {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <div className="mt-0.5">
                          <Stars value={r.rating} size="h-3.5 w-3.5" />
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-[#5C4D3C]">{r.comment}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => toast.success("Marked as helpful.")}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5C4D3C]/60 transition hover:text-[#342417] cursor-pointer"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            Helpful
                          </button>
                          {isMine && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(r._id)}
                              className="text-[11px] font-bold text-red-500/80 transition hover:text-red-600 cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* ── Right: sticky sidebar ── */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* Listed by */}
            <div className="rounded-2xl border border-mist bg-white/90 p-5 shadow-[0_14px_40px_-22px_rgba(52,36,23,0.4)]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#5C4D3C]/60">
                  Listed by
                </span>
                <span
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold"
                  style={{ backgroundColor: `${LISTER_BADGE[lister.type].tint}1a`, color: LISTER_BADGE[lister.type].tint }}
                >
                  <ListerIcon className="h-3.5 w-3.5" />
                  {lister.type}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-sm"
                  style={{ backgroundColor: accent }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-extrabold text-[#342417]">
                    <span className="truncate">{lister.name}</span>
                    {lister.verified && <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />}
                  </p>
                  <p className="truncate text-xs text-[#5C4D3C]/70">
                    {lister.company ?? (lister.type === "Personal" ? "Property owner" : lister.type)}
                  </p>
                  {typeof lister.listings === "number" && (
                    <p className="text-[11px] text-[#5C4D3C]/50">{lister.listings} active listings</p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <a
                  href={lister.phone ? `tel:${lister.phone.replace(/\s/g, "")}` : undefined}
                  className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-105 cursor-pointer"
                  style={{ backgroundColor: accent }}
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <button
                  type="button"
                  onClick={() => toast.success("Message sent to the lister.")}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-mist bg-white px-3 py-2.5 text-xs font-bold text-[#342417] transition hover:border-[#342417]/25 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
              </div>
            </div>

            {/* Schedule a visit */}
            <div className="overflow-hidden rounded-2xl border border-mist bg-white/90 shadow-[0_14px_40px_-22px_rgba(52,36,23,0.4)]">
              <div className="flex items-center gap-2 px-5 py-4" style={{ background: `linear-gradient(180deg, ${accent}12, transparent)` }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundColor: accent }}>
                  <CalendarDays className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-extrabold leading-none text-[#342417]">
                    {isOwner ? "Visit requests" : "Schedule a visit"}
                  </p>
                  <p className="mt-1 text-[11px] text-[#5C4D3C]/60">
                    {isOwner ? "Confirm or decline requests for this property" : "Pick a date & time that suits you"}
                  </p>
                </div>
              </div>

              {authLoading ? (
                <div className="px-5 py-8">
                  <div className="h-24 animate-pulse rounded-xl bg-[#EFE7D8]" />
                </div>
              ) : isOwner ? (
                <OwnerVisitRequests propertyId={property.id} />
              ) : visitBooked ? (
                <div className="flex flex-col items-center px-5 py-8 text-center">
                  <CheckCircle2 className="mb-3 h-12 w-12 text-emerald-500" />
                  <p className="text-sm font-extrabold text-[#342417]">Visit requested</p>
                  <p className="mt-1 text-xs text-[#5C4D3C]/70">
                    {visit.date} · {visit.slot}
                  </p>
                  <p className="mt-1 text-[11px] text-[#5C4D3C]/55">
                    {lister.name} will confirm your visit shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisitBooked(false)}
                    className="mt-4 text-xs font-bold underline"
                    style={{ color: accent }}
                  >
                    Edit request
                  </button>
                </div>
              ) : (
                <form onSubmit={submitVisit} className="space-y-3 px-5 py-5">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#5C4D3C]/70">Preferred date</label>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4D3C]/40" />
                      <input
                        type="date"
                        value={visit.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setVisit((v) => ({ ...v, date: e.target.value }))}
                        className={`${fieldCls} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#5C4D3C]/70">Time slot</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {TIME_SLOTS.map((slot) => {
                        const active = visit.slot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setVisit((v) => ({ ...v, slot }))}
                            style={active ? { backgroundColor: accent, borderColor: accent, color: "#fff" } : undefined}
                            className={`flex items-center justify-center gap-1 rounded-lg border py-2 text-[11px] font-bold transition cursor-pointer ${
                              active ? "" : "border-mist bg-white text-[#5C4D3C]/70 hover:text-[#342417]"
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={visit.name}
                    onChange={(e) => setVisit((v) => ({ ...v, name: e.target.value }))}
                    placeholder="Your name"
                    className={fieldCls}
                  />
                  <input
                    type="tel"
                    value={visit.phone}
                    onChange={(e) => setVisit((v) => ({ ...v, phone: e.target.value }))}
                    placeholder="Phone number"
                    className={fieldCls}
                  />

                  <button
                    type="submit"
                    disabled={submittingVisit}
                    style={{ backgroundColor: accent }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-[0.99] cursor-pointer disabled:opacity-70"
                  >
                    <CalendarDays className="h-4 w-4" />
                    {submittingVisit ? "Requesting…" : "Request visit"}
                  </button>
                  <p className="text-center text-[10px] text-[#5C4D3C]/50">
                    No charges — the lister confirms before the visit.
                  </p>
                </form>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ── small presentational helpers ── */

function Fact({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Home;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-mist bg-sand/30 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}14`, color: accent }}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C4D3C]/55">{label}</p>
        <p className="truncate text-sm font-extrabold text-[#342417]">{value}</p>
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  icon?: typeof Home;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-mist bg-white/85 p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#342417]">
        {Icon && <Icon className="h-4.5 w-4.5" style={{ color: accent ?? "#342417" }} />}
        {title}
      </h2>
      {children}
    </section>
  );
}
