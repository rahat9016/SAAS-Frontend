import * as Yup from "yup";

export const seasonStatusOptions = [
  { label: "On Planning", value: "On Planning" },
  { label: "On Concept", value: "On Concept" },
  { label: "On Process", value: "On Process" },
  { label: "Completed", value: "Completed" },
];

export const seasonSchema = Yup.object({
  season: Yup.string().required("Season name is required"),
  status: Yup.string()
    .oneOf(["Completed", "On Process", "On Concept", "On Planning"])
    .required("Status is required"),
});

export type SeasonFormValues = Yup.InferType<typeof seasonSchema>;
