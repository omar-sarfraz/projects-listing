import dayjs from "dayjs";
import { ProjectInput, User } from "../../lib/types";

interface Props extends ProjectInput {
    user: User | undefined;
}

export const createProjectFormData = ({
    name,
    budget,
    deadline,
    description,
    user,
    files,
}: Props) => {
    const deadlineWithTimezone = dayjs(deadline).toISOString();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("budget", budget);
    formData.append("deadline", deadlineWithTimezone);
    formData.append("description", description);
    if (user?.id) formData.append("userId", String(user.id));
    if (files?.length) {
        for (let i = 0; i < files.length; i++) {
            formData.append("projectFiles", files[i]);
        }
    }
    return formData;
};
