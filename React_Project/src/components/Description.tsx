import { Icon } from "@iconify/react";

import Markdown from "react-markdown";
import { useToggle } from "@mantine/hooks";

const MAX_CHAR_LENGTH = 100;

export default function Description({
    description,
    customClasses,
}: {
    description: string;
    customClasses?: string;
}) {
    const [open, toggle] = useToggle([false, true]);

    const shouldShowMore = description.length > MAX_CHAR_LENGTH ? true : false;

    return (
        <>
            <div className={customClasses ?? ""}>
                {shouldShowMore && !open ? (
                    <Markdown className="reactMarkDown">
                        {description.slice(0, description.indexOf("\n")) + " ..."}
                    </Markdown>
                ) : (
                    <Markdown className="reactMarkDown">{description}</Markdown>
                )}
            </div>

            {shouldShowMore && (
                <div className="w-full my-2 flex gap-1 justify-center items-center">
                    <button className="text-lg font-medium" onClick={() => toggle()}>
                        View More
                    </button>
                    <Icon icon={open ? "ph:arrow-up-bold" : "ph:arrow-down-bold"} />
                </div>
            )}
        </>
    );
}
