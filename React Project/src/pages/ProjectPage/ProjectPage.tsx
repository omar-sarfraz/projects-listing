import { useLocation } from "react-router-dom";
import { Project } from "../../lib/types";

export default function ProjectPage() {
    let { state }: { state: Project } = useLocation();

    return (
        <>
            <div className="flex gap-4 justify-between py-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl italic">Budget </h2>
                    <p className="border-cyan-500 text-cyan-500 border-[1px] rounded-xl text-xl px-4 font-semibold">
                        {state.budget} $
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl italic">Deadline </h2>
                    <p className="border-cyan-500 text-cyan-500 border-[1px] rounded-xl text-xl px-4 font-semibold">
                        {new Date(state.deadline).toDateString()}
                    </p>
                </div>
            </div>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Project Name</h2>
            <p className="text-2xl mt-4">{state.name}</p>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Description </h2>
            <p className="text-xl mt-4">{state.description}</p>
        </>
    );
}
