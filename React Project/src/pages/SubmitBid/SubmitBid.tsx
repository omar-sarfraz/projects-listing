import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { USER_ROLES } from "../../lib/utils";
import { bidSchema } from "./validationSchema";
import TextField from "../../components/TextField";
import TextEditor from "../../components/TextEditor";
import useAxios from "../../hooks/useAxios";
import { marked } from "marked";
import { Form, Formik, FormikHelpers } from "formik";
import dayjs from "dayjs";

type BidInput = {
    budget: string;
    deadline: string;
    description: string;
};

export default function AddBid() {
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    const { toast } = useToast();
    const { state } = useLocation();
    const axiosInstance = useAxios();

    const initialValues = {
        budget: state ? state.budget : "",
        deadline: deadline,
        description: description,
    };

    useEffect(() => {
        if (user?.role !== USER_ROLES.freelancer) {
            toast("Only freelancer can bid on a project", "error");
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (state) updateBidFilds();
    }, []);

    const updateBidFilds = async () => {
        const dateStr = dayjs(state.deadline).format("YYYY-MM-DD");
        setDeadline(dateStr);

        let html = await marked.parse(state.description);
        setDescription(html);
    };

    const handleBidSubmit = async (
        { deadline, description, budget }: BidInput,
        actions: FormikHelpers<BidInput>
    ) => {
        try {
            setLoading(true);

            let url = `projects/${params.id}/bids`;
            if (state) url += `/${state.id}`;

            const deadlineWithTimezone = dayjs(deadline).toISOString();

            const requestData = {
                budget,
                description,
                userId: user?.id,
                deadline: deadlineWithTimezone,
            };

            if (state) await axiosInstance.put(url, requestData);
            else await axiosInstance.post(url, requestData);

            actions.resetForm();
            toast("Bid Submitted Successfully!", "success");
            navigate("/projects/" + params.id);
        } catch (e: any) {
            console.log(e?.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl mb-6">Bid on a project</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={handleBidSubmit}
                validationSchema={bidSchema}
                enableReinitialize={true}
            >
                <Form className="flex flex-col gap-4 items-end bg-gray-100 px-6 py-10 rounded-md">
                    <TextField
                        required={true}
                        label="Budget"
                        type="number"
                        placeholder="e.g., 500"
                        name="budget"
                    />
                    <TextField
                        name="deadline"
                        required={true}
                        placeholder="Date"
                        label="Deadline"
                        type="date"
                        min={dayjs().format("YYYY-MM-DD")}
                    />
                    <div className="flex flex-col w-full items-start md:flex-row">
                        <label className="w-full md:w-1/3 text-xl">Description</label>
                        <div className="w-full md:w-2/3">
                            <TextEditor
                                name="description"
                                placeholder="e.g., I have experience in this kind of project..."
                            />
                        </div>
                    </div>
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
