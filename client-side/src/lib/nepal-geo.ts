// Shared Nepal geography + locale data used across the property and portfolio
// wizards. Keep this the single source of truth for provinces/districts so the
// two flows never drift apart.

export const PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
] as const;

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  "Koshi Province": ["Jhapa", "Ilam", "Panchthar", "Taplejung", "Morang", "Sunsari", "Dhankuta", "Terhathum", "Sankhuwasabha", "Bhojpur", "Solukhumbu", "Khotang", "Okhaldhunga", "Udayapur"],
  "Madhesh Province": ["Saptari", "Siraha", "Dhanusha", "Mahottari", "Sarlahi", "Rautahat", "Bara", "Parsa"],
  "Bagmati Province": ["Kathmandu", "Lalitpur", "Bhaktapur", "Kavrepalanchok", "Sindhupalchok", "Nuwakot", "Rasuwa", "Dhading", "Makwanpur", "Sindhuli", "Ramechhap", "Dolkha", "Chitwan"],
  "Gandaki Province": ["Kaski", "Tanahun", "Gorkha", "Lamjung", "Syangja", "Parbat", "Baglung", "Myagdi", "Mustang", "Manang", "Nawalpur"],
  "Lumbini Province": ["Rupandehi", "Kapilvastu", "Parasi", "Arghakhanchi", "Gulmi", "Palpa", "Pyuthan", "Rolpa", "Eastern Rukum", "Dang", "Banke", "Bardiya"],
  "Karnali Province": ["Rukum West", "Salyan", "Surkhet", "Dailekh", "Jajarkot", "Dolpa", "Jumla", "Kalikot", "Mugu", "Humla"],
  "Sudurpashchim Province": ["Bajura", "Bajhang", "Darchula", "Baitadi", "Dadeldhura", "Kanchanpur", "Doti", "Kailali", "Achham"],
};

/** Flat, sorted, de-duplicated list of every district — used for service-area multiselect. */
export const ALL_DISTRICTS: string[] = Array.from(
  new Set(Object.values(DISTRICTS_BY_PROVINCE).flat())
).sort((a, b) => a.localeCompare(b));

export const LANGUAGE_OPTIONS = [
  "Nepali",
  "English",
  "Hindi",
  "Newari",
  "Maithili",
  "Bhojpuri",
  "Tamang",
  "Tharu",
  "Gurung",
  "Magar",
] as const;
