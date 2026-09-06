/**
 * Centralized Material Type → Material Class → Material Sub Class hierarchy.
 * Every cascading dropdown (create/edit) and the grouped Materials table
 * read from this single source of truth.
 */
export const MATERIAL_TYPES = [
  "Add-Ons",
  "Artwork",
  "Fabric",
  "Filler",
  "Finishing",
  "Interlining",
  "Labeling",
  "Lining",
  "Packing",
  "Padding",
  "Trims",
  "Yarn",
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];

export const materialHierarchy: Record<MaterialType, Record<string, string[]>> = {
  "Add-Ons": {
    Buttons: ["Shirt Button", "Coat Button", "Decorative Button"],
    Zippers: ["Metal Zipper", "Nylon Zipper", "Invisible Zipper"],
    "Snaps & Rivets": ["Snap Button", "Rivet", "Hook & Eye"],
  },
  Artwork: {
    Print: ["Screen Print", "Digital Print", "Heat Transfer"],
    Embroidery: ["Flat Embroidery", "3D Puff Embroidery", "Chainstitch"],
    Applique: ["Fabric Applique", "Patch"],
  },
  Fabric: {
    Woven: ["Cotton Woven", "Poly Woven", "Denim"],
    Knit: ["Jersey", "Rib", "Fleece"],
    "Non-Woven": ["Felt", "Interfacing Base"],
  },
  Filler: {
    "Fiber Fill": ["Polyester Fiber", "Hollow Fiber"],
    Foam: ["PU Foam", "EVA Foam"],
    Down: ["Duck Down", "Goose Down"],
  },
  Finishing: {
    Wash: ["Enzyme Wash", "Stone Wash", "Silicon Wash"],
    "Print Finish": ["Puff Finish", "Glitter Finish"],
    Coating: ["PU Coating", "Wax Coating"],
  },
  Interlining: {
    Fusible: ["Woven Fusible", "Non-Woven Fusible", "Knit Fusible"],
    "Non-Fusible": ["Sew-in Canvas", "Sew-in Cotton"],
  },
  Labeling: {
    "Main Label": ["Woven Main Label", "Printed Main Label"],
    "Care Label": ["Satin Care Label", "Cotton Care Label"],
    "Size Label": ["Woven Size Label", "Printed Size Label"],
  },
  Lining: {
    "Body Lining": ["Polyester Lining", "Viscose Lining"],
    "Sleeve Lining": ["Twill Lining", "Satin Lining"],
    "Pocket Lining": ["Poplin Lining", "Cotton Pocketing"],
  },
  Packing: {
    "Poly Bag": ["Self-Adhesive Poly Bag", "Header Poly Bag"],
    Carton: ["Export Carton", "Master Carton"],
    "Hang Tag": ["Paper Hang Tag", "Plastic Hang Tag"],
  },
  Padding: {
    "Shoulder Pad": ["Foam Shoulder Pad", "Fiber Shoulder Pad"],
    "Bra Pad": ["Foam Bra Pad", "Mesh Bra Pad"],
    "Quilted Padding": ["Fiber Quilted Pad", "Foam Quilted Pad"],
  },
  Trims: {
    Elastic: ["Woven Elastic", "Knit Elastic", "Braided Elastic"],
    Tape: ["Twill Tape", "Bias Tape"],
    "Cord & Drawstring": ["Cotton Cord", "Poly Drawstring"],
  },
  Yarn: {
    "Cotton Yarn": ["Combed Cotton", "Carded Cotton"],
    "Polyester Yarn": ["Recycled Polyester", "Virgin Polyester"],
    "Blended Yarn": ["Cotton-Poly Blend", "Cotton-Spandex Blend"],
  },
};
