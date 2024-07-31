import { useLocation } from "react-router-dom";
import { Project } from "../ProjectsList/ProjectList";

export default function ProjectPage() {
    let { state }: { state: Project } = useLocation();

    return (
        <div className="grid grid-rows-8 grid-cols-8 gap-8">
            <div className="row-span-4 col-span-4 bg-red-500 rounded-xl">
                <h2 className="text-2xl  font-extrabold tracking-wide italic bg-white w-fit rounded-br-lg p-2">
                    Project Name
                </h2>
                <p className="text-4xl text-white font-extrabold text-center py-6 px-4">
                    {state.Name}
                </p>
            </div>
            <div className="row-span-4 col-span-4 bg-green-500 rounded-xl">
                <h2 className="text-2xl  font-extrabold tracking-wide italic bg-white w-fit rounded-br-lg p-2">
                    Description{" "}
                </h2>
                <p className="text-xl text-white font-extrabold text-center py-6 px-4">
                    {state.Description}
                </p>
            </div>
            <div className="row-span-4 col-span-4 bg-cyan-500 rounded-xl">
                <h2 className="text-2xl  font-extrabold tracking-wide italic bg-white w-fit rounded-br-lg p-2">
                    Budget{" "}
                </h2>
                <p className="text-4xl text-white font-extrabold text-center py-6 px-4">
                    {state.Budget}
                </p>
            </div>
            <div className="row-span-4 col-span-4 bg-blue-500 rounded-xl">
                <h2 className="text-2xl  font-extrabold tracking-wide italic bg-white w-fit rounded-br-lg p-2">
                    Timeline{" "}
                </h2>
                <p className="text-4xl text-white font-extrabold text-center py-6 px-4">
                    {state.Timeline}
                </p>
            </div>
        </div>
    );
}
