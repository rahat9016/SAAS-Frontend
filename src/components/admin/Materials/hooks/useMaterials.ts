"use client";

import { useEffect, useState } from "react";
import { IMaterial, MaterialFormValues } from "../types";

const STORAGE_KEY = "materials";

const generateId = () =>
  `MAT-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const getDefaultMaterials = (): IMaterial[] => {
  const seeds: MaterialFormValues[] = [
    {
      materialType: "Fabric",
      materialClass: "Woven",
      materialSubClass: "Cotton Woven",
      material: "100% Cotton Poplin 120gsm",
      materialDescription: "Lightweight cotton poplin for shirting",
      isSustainable: true,
    },
    {
      materialType: "Fabric",
      materialClass: "Knit",
      materialSubClass: "Jersey",
      material: "Cotton Jersey 180gsm",
      materialDescription: "Single jersey knit for t-shirts",
      isSustainable: false,
    },
    {
      materialType: "Trims",
      materialClass: "Elastic",
      materialSubClass: "Woven Elastic",
      material: "25mm Woven Elastic",
      materialDescription: "Waistband elastic",
      isSustainable: false,
    },
    {
      materialType: "Labeling",
      materialClass: "Main Label",
      materialSubClass: "Woven Main Label",
      material: "Brand Woven Main Label",
      materialDescription: "Center back neck main label",
      isSustainable: false,
    },
    {
      materialType: "Yarn",
      materialClass: "Cotton Yarn",
      materialSubClass: "Combed Cotton",
      material: "30s Combed Cotton Yarn",
      materialDescription: "Ring-spun combed cotton yarn",
      isSustainable: true,
    },
  ];

  return seeds.map((seed) => ({
    ...seed,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }));
};

const loadMaterials = (): IMaterial[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as IMaterial[];
    } catch {
      // ignore corrupted data
    }
  }
  return getDefaultMaterials();
};

const persistMaterials = (items: IMaterial[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

export function useMaterials() {
  // Seeded identically on server and first client render to avoid a
  // hydration mismatch; the real localStorage value is loaded right
  // after mount (client-only).
  const [materials, setMaterials] = useState<IMaterial[]>(getDefaultMaterials);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMaterials(loadMaterials());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persistMaterials(materials);
  }, [materials, hydrated]);

  const addMaterial = (values: MaterialFormValues) => {
    const item: IMaterial = {
      ...values,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setMaterials((prev) => [...prev, item]);
    return item;
  };

  const updateMaterial = (id: string, values: MaterialFormValues) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...values } : m))
    );
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return { materials, addMaterial, updateMaterial, deleteMaterial };
}
