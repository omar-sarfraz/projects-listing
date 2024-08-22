import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { USER_ROLES } from "../../lib/utils";
import { bidSchema } from "./validationSchema";
import TextField from "../../components/TextField";
import TextEditor from "../../components/TextEditor";
import useAxios from "../../hooks/useAxios";

export default function AddBid() {
    const [budget, setBudget] = useState<string>();
    const [deadline, setDeadline] = useState<string>();
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    const { toast } = useToast();
    const axiosInstance = useAxios();

    useEffect(() => {
        if (user?.role !== USER_ROLES.freelancer) {
            toast("Only freelancer can bid on a project", "error");
            navigate("/");
        }
    }, []);

    const handleProjectSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await bidSchema.validate({ budget, deadline, description }, { abortEarly: false });
        } catch (e: any) {
            const firstError = e.inner[0];
            toast(firstError.errors[0], "error");
            return;
        }

        try {
            setLoading(true);

            await axiosInstance.post(
                `projects/${params.id}/bids`,
                { budget, deadline, description, userId: user?.id },
                { headers: { Authorization: "Bearer " + user?.token } }
            );

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
            <form className="flex flex-col gap-4 items-end bg-gray-100 px-6 py-10 rounded-md">
                <TextField
                    required={true}
                    label="Budget"
                    type="number"
                    placeholder="e.g., 500"
                    setCurrentValue={setBudget}
                />
                <TextField
                    required={true}
                    placeholder="Date"
                    setCurrentValue={setDeadline}
                    label="Deadline"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                />
                <div className="flex flex-col w-full items-start md:flex-row">
                    <label className="w-full md:w-1/3 text-xl">Description</label>
                    <div className="w-full md:w-2/3">
                        <TextEditor
                            value={description}
                            setValue={setDescription}
                            placeholder="e.g., I have experience in this kind of project..."
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-green-600 font-semibold text-white text-md px-4 py-2 rounded-md w-full md:w-1/3 mt-4 outline-none"
                    onClick={handleProjectSubmit}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
