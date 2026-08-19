// Exact field sets from the client's Blouse / Kurta Set measurement forms.
// Keys are stored inside the `fields` JSONB column on the `measurements` table.

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea";
};

export const BLOUSE_FIELDS: FieldDef[] = [
  { key: "blouseHeight", label: "Blouse Height", type: "text" },
  { key: "chestUpper", label: "Chest — Upper", type: "text" },
  { key: "chestProper", label: "Chest — Proper", type: "text" },
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
  { key: "chestUpper", label: "Chest — Upper", type: "text" },
  { key: "chestProper", label: "Chest — Proper", type: "text" },
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
