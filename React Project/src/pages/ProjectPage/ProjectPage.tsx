import { Link, useParams } from "react-router-dom";

import NextIcon from "../../assets/next-icon.svg";
import { USER_ROLES } from "../../lib/utils";
import BidsList from "../../components/BidsList";
import Description from "../../components/Description";
import useProject from "../../hooks/useProject";
import { useAuth } from "../../contexts/AuthContext";

export default function ProjectPage() {
    const { project, loading, canBid, handleAcceptBid, handleDeleteBid } = useProject();

    const params = useParams();
    const { user } = useAuth();

    if (loading) return <div>Loading</div>;

    if (!project) return <div>Project not found!</div>;

    return (
        <>
            <div className="flex gap-4 justify-between py-4">
                <div className="flex items-center gap-2 border-[1px] border-cyan-500 rounded-xl py-2 px-4">
                    <h2 className="text-xl">Budget </h2>
                    <p className=" text-cyan-500 text-2xl font-semibold">{project.budget} $</p>
                </div>
                <div className="flex items-center gap-2 border-[1px] border-cyan-500 rounded-xl py-2 px-4">
                    <h2 className="text-xl">Deadline </h2>
                    <p className="text-cyan-500 text-2xl font-semibold">
                        {new Date(project.deadline).toDateString()}
                    </p>
                </div>
                {canBid && (
                    <Link
                        to={`/projects/${params.id}/bid`}
                        className="flex items-center bg-emerald-500 rounded-xl py-2 px-4"
                    >
                        <div className="text-white font-semibold text-xl py-2 px-4 rounded-full">
                            Bid on this project
                        </div>
                        <img src={NextIcon} className="w-6" />
                    </Link>
                )}
            </div>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Project Name</h2>
            <p className="text-2xl mt-4">{project.name}</p>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Description </h2>
            <div className="mt-4">
                <Description description={project.description} customClasses="text-xl" />
            </div>
            {project.bids?.length ? (
                <BidsList
                    bids={project.bids}
                    canAccept={
                        user?.role === USER_ROLES.client &&
                        user.id === project.userId &&
                        !project.acceptedBid
                    }
                    acceptedBid={project.acceptedBid}
                    handleAcceptBid={handleAcceptBid}
                    handleDeleteBid={handleDeleteBid}
                />
            ) : null}
        </>
    );
}
