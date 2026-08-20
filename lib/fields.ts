// Exact field sets from the client's Blouse / Kurta Set measurement forms.
// Keys are stored inside the `fields` JSONB column on the `measurements` table.

export type SimpleFieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea";
};

// A "pair" renders as one label with two side-by-side boxes (e.g. Chest: U | P),
// matching how the client actually writes it on paper. The two boxes still save
// to two independent keys under the hood, so nothing about storage changes.
export type PairFieldDef = {
  key: string; // used only as a React key / grouping id, not stored directly
  label: string;
  type: "pair";
  subFields: [{ key: string; shortLabel: string }, { key: string; shortLabel: string }];
};

export type FieldDef = SimpleFieldDef | PairFieldDef;

export const BLOUSE_FIELDS: FieldDef[] = [
  { key: "blouseHeight", label: "Blouse Height", type: "text" },
  {
    key: "chest",
    label: "Chest",
    type: "pair",
    subFields: [
      { key: "chestUpper", shortLabel: "Upper (U)" },
      { key: "chestProper", shortLabel: "Proper (P)" },
    ],
  },
  { key: "waistFitting", label: "Waist Fitting", type: "text" },
  { key: "neck", label: "Neck", type: "text" },
  { key: "shoulder", label: "Shoulder", type: "text" },
  { key: "armhole", label: "Armhole", type: "text" },
  { key: "dotPoint", label: "Dot Point", type: "text" },
  { key: "crossFront", label: "Cross Front", type: "text" },
  { key: "crossBack", label: "Cross Back", type: "text" },
  { key: "shortSleeves", label: "Short Sleeves", type: "text" },
  { key: "longSleeves", label: "Long Sleeves", type: "text" },
  { key: "blouseStyle", label: "Blouse Style", type: "text" },
  { key: "note", label: "Note", type: "textarea" },
];

export const KURTA_FIELDS: FieldDef[] = [
  { key: "kurtaHeight", label: "Kurta Height", type: "text" },
  { key: "waistHeight", label: "Waist Height", type: "text" },
  {
    key: "chest",
    label: "Chest",
    type: "pair",
    subFields: [
      { key: "chestUpper", shortLabel: "Upper (U)" },
      { key: "chestProper", shortLabel: "Proper (P)" },
    ],
  },
  { key: "waistFitting", label: "Waist Fitting", type: "text" },
  { key: "hip", label: "Hip", type: "text" },
  { key: "neck", label: "Neck", type: "text" },
  { key: "shoulder", label: "Shoulder", type: "text" },
  { key: "armhole", label: "Armhole", type: "text" },
  { key: "shortSleeves", label: "Short Sleeves", type: "text" },
  { key: "longSleeves", label: "Long Sleeves", type: "text" },
  { key: "cut", label: "Cut", type: "text" },
  { key: "pantHeight", label: "Pant Height", type: "text" },
  { key: "pantWaist", label: "Pant Waist", type: "text" },
  { key: "thigh", label: "Thigh", type: "text" },
  { key: "knee", label: "Knee", type: "text" },
  { key: "calf", label: "Calf", type: "text" },
  { key: "pantBottom", label: "Pant Bottom", type: "text" },
  { key: "notes", label: "Notes", type: "textarea" },
];

export type MeasurementType = "blouse" | "kurta";

export function fieldsFor(type: MeasurementType): FieldDef[] {
  return type === "blouse" ? BLOUSE_FIELDS : KURTA_FIELDS;
}

export const TYPE_LABEL: Record<MeasurementType, string> = {
  blouse: "Blouse",
  kurta: "Kurta Set",
};

export const BRAND_NAME = "Sharmilee Boutique";
