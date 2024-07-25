import { LoginError } from "../pages/Login/Login";
import { SignUpError } from "../pages/SignUp/SignUp";

type TextFieldProps = {
    currentValue: string;
    setCurrentValue: Function;
    error: LoginError | SignUpError;
    type: string;
    customClassNames?: string;
    placeholder: string;
    label: string;
    errorType: string;
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
}: TextFieldProps) {
    return (
        <div className="flex flex-col gap-1 mt-3">
            <label className="text-xl">{label}</label>
            <input
                value={currentValue}
                type={type}
                placeholder={placeholder}
                onChange={(e) => setCurrentValue(e.target.value)}
                className={`p-2 rounded-md outline-none ${
                    error.type === errorType ? "border-2 border-red-500" : ""
                } ${customClassNames ?? ""}`}
            />
            {error.type === errorType && <p className="text-red-500 pl-2">{error.message}</p>}
        </div>
    );
}
