import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useDocumentTitle } from "@mantine/hooks";

import { USER_ROLES } from "../../lib/utils";
import { BASE_URL } from "../../configs/urls";

import BidsList from "../../components/BidsList";
import Description from "../../components/Description";
import ConfirmationDialog from "../../components/ConfirmationDialog";

import { useAuth } from "../../contexts/AuthContext";
import useProject from "../../hooks/useProject";
import Comments from "../../components/Comments";

export default function ProjectPage() {
    const { project, loading, canBid, handleAcceptBid, handleDeleteBid, handleDeleteProject } =
        useProject();

    const params = useParams();
    const { user } = useAuth();

    useDocumentTitle(project?.name || "Project");

    if (loading) return <div>Loading</div>;

    if (!project) return <div>Project not found!</div>;

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 justify-between py-4">
                <div className="flex justify-between items-center gap-2 border-[1px] border-cyan-500 rounded-xl py-2 px-4">
                    <h2 className="text-xl">Budget </h2>
                    <p className=" text-cyan-500 text-2xl font-semibold">{project.budget} $</p>
                </div>
                <div className="flex items-center justify-between gap-2 border-[1px] border-cyan-500 rounded-xl py-2 px-4">
                    <h2 className="text-xl">Deadline </h2>
                    <p className="text-cyan-500 text-xl sm:text-2xl font-semibold">
                        {new Date(project.deadline).toDateString()}
                    </p>
                </div>
                {canBid && (
                    <Link
                        to={`/projects/${params.id}/bid`}
                        className="flex items-center justify-between bg-emerald-500 rounded-xl py-2 px-4 gap-2"
                    >
                        <div className="text-white font-semibold text-xl">Bid on this project</div>
                        <Icon icon="carbon:next-filled" fontSize={24} color="white" />
                    </Link>
                )}
                {project.userId === user?.id ? (
                    <div className="flex gap-2">
                        <Link
                            to={`/projects/submit`}
                            state={project}
                            className="flex items-center bg-emerald-500 rounded-xl py-2 px-4 gap-2"
                        >
                            <div className="text-white font-semibold text-xl">Edit</div>
                            <Icon icon="basil:edit-solid" fontSize={24} color="white" />
                        </Link>
                        <ConfirmationDialog
                            onClick={handleDeleteProject}
                            title="Confirm Project Deletion"
                            description="Do you really want to delete this project? This action is irreversible."
                        >
                            <button className="flex items-center bg-red-500 rounded-xl py-2 px-4 gap-1 h-full">
                                <div className="text-white font-semibold text-xl">Delete</div>
                                <Icon
                                    icon="material-symbols-light:delete"
                                    fontSize={28}
                                    color="white"
                                />
                            </button>
                        </ConfirmationDialog>
                    </div>
                ) : null}
            </div>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Project Name</h2>
            <p className="text-2xl mt-4">{project.name}</p>
            <h2 className="text-xl italic underline underline-offset-8 mt-8">Description </h2>
            <div className="mt-4">
                <Description description={project.description} customClasses="text-xl" />
            </div>
            {project.files?.length ? (
                <>
                    <h2 className="text-xl italic underline underline-offset-8 mt-8">
                        Project Files{" "}
                    </h2>
                    <div className="mt-4 flex gap-4 flex-wrap">
                        {project.files.map((file) => (
                            <a
                                href={`${BASE_URL}/${file}`}
                                key={file}
                                className="flex gap-2 items-center border-[1px] py-1 px-2 rounded-md"
                                target="_blank"
                            >
                                <Icon icon="akar-icons:file" />
                                {file.split("/").pop()}
                            </a>
                        ))}
                    </div>
                </>
            ) : null}
            {project.bids?.length ? (
                <BidsList
                    bids={project.bids}
                    canAccept={
                        user?.role === USER_ROLES.client &&
                        user.id === project.userId &&
                        !project.acceptedBid
                    }
                    isFreelancer={user?.role === USER_ROLES.freelancer}
                    acceptedBid={project.acceptedBid}
                    handleAcceptBid={handleAcceptBid}
                    handleDeleteBid={handleDeleteBid}
                    projectOwner={project.userId}
                />
            ) : null}
            <Comments projectId={project.id} />
        </>
    );
}
