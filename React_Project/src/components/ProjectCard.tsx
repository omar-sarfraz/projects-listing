import { Link } from "react-router-dom";

import Markdown from "react-markdown";

import { Project } from "../lib/types";

export default function ProjectCard({ id, name, description, budget, deadline }: Project) {
    return (
        <li className="relative bg-gray-100 flex flex-col grow justify-between rounded-md p-4 sm:w-full lg:w-1/4 group">
            <div>
                <h3 className="text-2xl font-medium">
                    {id}: {name}
                </h3>
                <div className="my-4">
                    <div className="font-bold">Description:</div>
                    <Markdown>
                        {description.slice(
                            0,
                            description.indexOf("\n") !== -1
                                ? description.indexOf("\n")
                                : description.length
                        )}
                    </Markdown>
                </div>
            </div>
            <div>
                <div className="flex w-full justify-between group-hover:opacity-0 transition duration-500">
                    <div>
                        <h3 className="font-bold">Budget</h3>
                        <div className="bg-cyan-500 rounded-full px-3 mt-1 text-white">
                            {budget} $
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold">Deadline</h3>
                        <div className="bg-emerald-500 rounded-full px-3 mt-1 text-white">
                            {new Date(deadline).toDateString()}
                        </div>
                    </div>
                </div>
                <Link
                    to={`/projects/${id}`}
                    className="absolute left-0 w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-md text-center py-2 mt-4 opacity-0 group-hover:-translate-y-full group-hover:opacity-100 transition duration-500 ease-in-out"
                >
                    View More
                </Link>
            </div>
        </li>
    );
}
