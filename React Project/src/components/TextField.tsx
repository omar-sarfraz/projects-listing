import { useField } from "formik";

type TextFieldProps = {
    name: string;
    type: string;
    placeholder: string;
    label: string;
    required: boolean;
    min?: string;
    vertical?: boolean;
    customClassNames?: string;
};

export default function TextField({
    name,
    type,
    customClassNames,
    placeholder,
    label,
    min,
    required,
    vertical,
    ...props
}: TextFieldProps) {
    const [field, meta] = useField({ name, ...props });

    return (
        <div className={`flex ${!vertical && "md:flex-row"} flex-col gap-1 mt-3 w-full`}>
            <label className={`text-xl w-full ${!vertical && "md:w-1/3"}`}>{label}</label>
            <div className={`w-full ${!vertical && "md:w-2/3"}`}>
                <input
                    type={type}
                    placeholder={placeholder}
                    className={`p-2 rounded-md outline-none w-full ${
                        meta.error && meta.touched ? "border-2 border-red-500" : ""
                    } ${customClassNames ?? ""}`}
                    min={min}
                    required={required}
                    {...props}
                    {...field}
                />
                {meta.error && meta.touched && <p className="text-red-500 pl-2">{meta.error}</p>}
            </div>
        </div>
    );
}
