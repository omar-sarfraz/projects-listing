type TextFieldProps = {
    setCurrentValue: Function;
    type: string;
    customClassNames?: string;
    placeholder?: string;
    label: string;
    min?: string;
};

export default function TextField({
    setCurrentValue,
    type,
    customClassNames,
    placeholder,
    label,
    min,
}: TextFieldProps) {
    return (
        <div className="flex flex-col w-full items-center md:flex-row">
            <label className="w-full md:w-1/3 text-xl">{label}</label>
            <input
                className={`w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none placeholder:text-gray-500 text-gray-500 ${
                    customClassNames ?? ""
                }`}
                name={label}
                type={type}
                placeholder={placeholder}
                min={min}
                required
                onChange={(e) => setCurrentValue(e.target.value)}
            />
        </div>
    );
}
