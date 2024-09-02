import { useField } from "formik";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ name, placeholder, ...props }: { name: string; placeholder: string }) => {
    const [field] = useField({ name, ...props });

    return (
        <ReactQuill
            theme="snow"
            placeholder={placeholder}
            className="w-full h-64 pb-11 bg-white"
            {...props}
            {...field}
        />
    );
};

export default TextEditor;
