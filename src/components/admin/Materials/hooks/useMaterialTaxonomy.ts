"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MATERIAL_TYPES,
  materialHierarchy,
} from "../data/materialHierarchy";
import {
  IMaterialClass,
  IMaterialSubClass,
  MaterialClassFormValues,
  MaterialSubClassFormValues,
} from "../types";

const CLASS_STORAGE_KEY = "material-classes";
const SUB_CLASS_STORAGE_KEY = "material-sub-classes";

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Deterministic id for seeded rows so server and first client render match. */
const seedClassId = (type: string, name: string) =>
  `CLS-${slug(type)}-${slug(name)}`;
const seedSubClassId = (classId: string, name: string) =>
  `SUB-${classId.replace(/^CLS-/, "")}-${slug(name)}`;

const generateId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const SEED_DATE = "2024-01-01T00:00:00.000Z";

const getDefaultClasses = (): IMaterialClass[] =>
  MATERIAL_TYPES.flatMap((type) =>
    Object.keys(materialHierarchy[type]).map((name) => ({
      id: seedClassId(type, name),
      materialType: type as string,
      name,
      createdAt: SEED_DATE,
    }))
  );

const getDefaultSubClasses = (): IMaterialSubClass[] =>
  MATERIAL_TYPES.flatMap((type) =>
    Object.entries(materialHierarchy[type]).flatMap(([className, subs]) => {
      const classId = seedClassId(type, className);
      return subs.map((name) => ({
        id: seedSubClassId(classId, name),
        classId,
        name,
        createdAt: SEED_DATE,
      }));
    })
  );

const load = <T,>(key: string, fallback: () => T[]): T[] => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved) as T[];
    } catch {
      // ignore corrupted data
    }
  }
  return fallback();
};

const persist = <T,>(key: string, items: T[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(items));
  }
};

export function useMaterialTaxonomy() {
  // Seeded identically on server and first client render to avoid a hydration
  // mismatch; the real localStorage value is loaded right after mount.
  const [classes, setClasses] = useState<IMaterialClass[]>(getDefaultClasses);
  const [subClasses, setSubClasses] =
    useState<IMaterialSubClass[]>(getDefaultSubClasses);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setClasses(load(CLASS_STORAGE_KEY, getDefaultClasses));
    setSubClasses(load(SUB_CLASS_STORAGE_KEY, getDefaultSubClasses));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persist(CLASS_STORAGE_KEY, classes);
  }, [classes, hydrated]);

  useEffect(() => {
    if (hydrated) persist(SUB_CLASS_STORAGE_KEY, subClasses);
  }, [subClasses, hydrated]);

  const addClass = (values: MaterialClassFormValues) => {
    const item: IMaterialClass = {
      ...values,
      id: generateId("CLS"),
      createdAt: new Date().toISOString(),
    };
    setClasses((prev) => [...prev, item]);
    return item;
  };

  const updateClass = (id: string, values: MaterialClassFormValues) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...values } : c))
    );
  };

  /** Deleting a class removes the sub classes that hang off it. */
  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    setSubClasses((prev) => prev.filter((s) => s.classId !== id));
  };

  const addSubClass = (values: MaterialSubClassFormValues) => {
    const item: IMaterialSubClass = {
      ...values,
      id: generateId("SUB"),
      createdAt: new Date().toISOString(),
    };
    setSubClasses((prev) => [...prev, item]);
    return item;
  };

  const updateSubClass = (id: string, values: MaterialSubClassFormValues) => {
    setSubClasses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...values } : s))
    );
  };

  const deleteSubClass = (id: string) => {
    setSubClasses((prev) => prev.filter((s) => s.id !== id));
  };

  const classById = useMemo(
    () => new Map(classes.map((c) => [c.id, c])),
    [classes]
  );

  /** Class names available for a Material Type — drives the cascading selects. */
  const getClassOptions = useCallback(
    (materialType: string) =>
      classes.filter((c) => c.materialType === materialType),
    [classes]
  );

  const getSubClassOptions = useCallback(
    (materialType: string, className: string) => {
      const parent = classes.find(
        (c) => c.materialType === materialType && c.name === className
      );
      if (!parent) return [];
      return subClasses.filter((s) => s.classId === parent.id);
    },
    [classes, subClasses]
  );

  const countSubClasses = useCallback(
    (classId: string) => subClasses.filter((s) => s.classId === classId).length,
    [subClasses]
  );

  return {
    classes,
    subClasses,
    classById,
    addClass,
    updateClass,
    deleteClass,
    addSubClass,
    updateSubClass,
    deleteSubClass,
    getClassOptions,
    getSubClassOptions,
    countSubClasses,
  };
}
