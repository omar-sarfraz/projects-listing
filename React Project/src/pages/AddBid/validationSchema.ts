import { object, string, date, number } from "yup";

export const bidSchema = object().shape({
    budget: number().min(1).required("Budget is required."),
    deadline: date().required("Deadline is required."),
    description: string().required("Description is required."),
});
