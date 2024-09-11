import { MessageType } from "../lib/types";

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
                className={`w-[60%] flex px-2 py-2 rounded-sm ${
                    message.userId === userId ? "bg-emerald-500 text-white" : "bg-gray-300"
                }`}
            >
                {message.text}
            </div>
        </div>
    );
}
