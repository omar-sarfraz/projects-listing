import { useField, useFormikContext } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ name, placeholder, ...props }: { name: string; placeholder: string }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (value: string) => {
        setFieldValue(name, value);
    };

    return (
        <div className="w-full">
            <ReactQuill
                theme="snow"
                placeholder={placeholder}
                value={field.value}
                onChange={handleChange}
                className="w-full h-64 pb-11 bg-white"
                {...props}
            />
            {meta.touched && meta.error ? (
                <div className="text-red-500 text-sm mt-1">{meta.error}</div>
            ) : null}
        </div>
    );
};

export default TextEditor;
