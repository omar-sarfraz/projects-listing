import { LoginError, SignUpError } from "../lib/types";

type TextFieldProps = {
    currentValue?: string;
    setCurrentValue: Function;
    error?: LoginError | SignUpError;
    type: string;
    customClassNames?: string;
    placeholder: string;
    label: string;
    errorType?: string;
    min?: string;
    required: boolean;
    vertical?: boolean;
};

export default function TextField({
    currentValue,
    setCurrentValue,
    error,
    type,
    customClassNames,
    placeholder,
    label,
    errorType,
    min,
    required,
    vertical,
}: TextFieldProps) {
    return (
        <div className={`flex ${!vertical && "md:flex-row"} flex-col gap-1 mt-3 w-full`}>
            <label className={`text-xl w-full ${!vertical && "md:w-1/3"}`}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className={`p-2 rounded-md outline-none w-full ${
                    errorType && error?.type === errorType ? "border-2 border-red-500" : ""
                } ${customClassNames ?? ""} ${!vertical && "md:w-2/3"}`}
                min={min}
                required={required}
            />
            {errorType && error?.type === errorType && (
                <p className="text-red-500 pl-2">{error?.message}</p>
            )}
        </div>
    );
}
