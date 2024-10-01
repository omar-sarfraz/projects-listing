import { MessageType } from "../lib/types";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export default function Message({
    message,
    userId,
}: {
    message: MessageType;
    userId: number | undefined;
}) {
    return (
        <div
            className={`w-full flex ${message.userId === userId ? "justify-end" : "justify-start"}`}
            key={message.id}
        >
            <div
                className={`w-[60%] flex flex-col px-2 py-2 rounded-md ${
                    message.userId === userId ? "bg-emerald-500 text-white" : "bg-gray-300"
                }`}
            >
                <div className="text-lg">{message.text}</div>
                <div className="w-full text-end text-sm">
                    {dayjs(message.createdAt).format("LLL")}
                </div>
            </div>
        </div>
    );
}
