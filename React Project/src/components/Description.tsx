import { useState } from "react";
import { Icon } from "@iconify/react";

const MAX_CHAR_LENGTH = 300;

export default function Description({
    description,
    customClasses,
}: {
    description: string;
    customClasses?: string;
}) {
    const [open, setOpen] = useState(false);

    const shouldShowMore = description.length > MAX_CHAR_LENGTH ? true : false;

    return (
        <>
            <div className={customClasses ?? ""}>
                {shouldShowMore && !open
                    ? description.slice(0, MAX_CHAR_LENGTH) + "..."
                    : description}
            </div>
            {shouldShowMore && (
                <div className="w-full my-2 flex gap-1 justify-center items-center">
                    <button className="text-lg font-medium" onClick={() => setOpen(!open)}>
                        View More
                    </button>
                    <Icon icon={open ? "ph:arrow-up-bold" : "ph:arrow-down-bold"} />
                </div>
            )}
        </>
    );
}
