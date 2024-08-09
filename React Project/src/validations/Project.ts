import { object, string, date, number } from "yup";

export const projectSchema = object().shape({
    name: string().required("Project Name is required."),
    budget: number().min(1).required("Budget is required."),
    deadline: date().required("Deadline is required."),
    description: string().required("Description is required."),
});
