import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({
    value,
    setValue,
    placeholder,
}: {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
}) => {
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            placeholder={placeholder}
            className="w-full"
        />
    );
};

export default TextEditor;
