import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

import { USER_ROLES } from "../../lib/utils";
import { ProjectInput } from "../../lib/types";

import TextField from "../../components/TextField";
import TextEditor from "../../components/TextEditor";
import { projectSchema } from "./validationSchema";
import useAxios from "../../hooks/useAxios";

import dayjs from "dayjs";
import * as marked from "marked";
import { Form, Formik, FormikHelpers } from "formik";
import { useDocumentTitle } from "@mantine/hooks";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { selectOnlineStatus } from "../../redux/onlineStatus/slice";
import { addOfflineEvent } from "../../redux/events/slice";
import FilesComponent from "../../components/FilesComponent";

export default function SubmitProject({ resubscribe }: { resubscribe: () => void }) {
    const [loading, setLoading] = useState(false);
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");

    const { toast } = useToast();
    const { user } = useAuth();
    const axiosInstance = useAxios();

    const navigate = useNavigate();
    const { state } = useLocation();

    const isOnline = useAppSelector(selectOnlineStatus);
    const dispatch = useAppDispatch();

    useDocumentTitle("Submit Project");

    const initialValues: ProjectInput = {
        name: state ? state.name : "",
        budget: state ? state.budget : "",
        deadline,
        description,
        files: state ? state.files : [],
    };

    useEffect(() => {
        if (user?.role !== USER_ROLES.client) {
            toast("Only clients can post a project", "error");
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (state) updateProjectFilds();
    }, []);

    const updateProjectFilds = async () => {
        const dateStr = dayjs(state.deadline).format("YYYY-MM-DD");
        setDeadline(dateStr);

        const html = await marked.parse(state.description);
        setDescription(html);
    };

    const handleProjectSubmit = async (
        { name, deadline, description, budget, files }: ProjectInput,
        actions: FormikHelpers<ProjectInput>
    ) => {
        try {
            setLoading(true);

            const payload = {
                name,
                deadline,
                description,
                budget,
                files,
                userId: user?.id,
            };

            const url = state ? `/projects/${state.id}` : "/projects";

            if (isOnline) {
                if (state) await axiosInstance.put(url, payload);
                else await axiosInstance.post(url, payload);

                toast("Project Submitted Successfully!", "success");
                resubscribe();
                navigate("/");
            }

            if (!isOnline && !state) {
                toast(
                    "It seems you are offline, we'll automatically post the project when you're back online",
                    "success"
                );
                dispatch(
                    addOfflineEvent({
                        payload: {
                            data: payload,
                            url,
                        },
                        name: "CREATE_PROJECT",
                    })
                );
            }

            actions.resetForm();
        } catch (e: any) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl mb-6">{state ? "Edit" : "Add"} a project</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={handleProjectSubmit}
                validationSchema={projectSchema}
                enableReinitialize={true}
            >
                <Form
                    className="flex flex-col gap-4 items-end bg-gray-100 px-6 py-10 rounded-md"
                    id="add_form"
                >
                    <TextField
                        required
                        name="name"
                        type="text"
                        label="Name"
                        placeholder="e.g., Ecommerce Website"
                    />
                    <TextField
                        required
                        name="budget"
                        label="Budget"
                        type="number"
                        placeholder="e.g., 500"
                    />
                    <TextField
                        required
                        name="deadline"
                        placeholder="Date"
                        label="Deadline"
                        type="date"
                        min={dayjs().format("YYYY-MM-DD")}
                    />
                    <div className="flex flex-col w-full items-start md:flex-row">
                        <label className="w-full md:w-1/3 text-xl" htmlFor="project_description">
                            Project Description
                        </label>
                        <div className="w-full md:w-2/3">
                            <TextEditor
                                name="description"
                                placeholder="e.g., I want you to create an Clothing Ecommerce Store using React"
                                type="PROJECT"
                            />
                        </div>
                    </div>
                    <FilesComponent name="files" />
                    <button
                        type="submit"
                        className="bg-green-600 font-semibold text-white text-md px-4 py-2 rounded-md w-full md:w-1/3 mt-4 outline-none"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </Form>
            </Formik>
        </div>
    );
}
