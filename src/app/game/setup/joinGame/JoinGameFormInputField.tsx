import React, {ChangeEvent} from "react";

type Props = {
name: string;
value: string;
onChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void;
type: string;
placeholder: string;
required: boolean;
maxLength?: number;
options?: string[]; // Updated to string array type
};

export default function JoinGameFormInputField({
                                               name,
                                               value,
                                               onChange,
                                               type,
                                               placeholder,
                                               required,
                                               maxLength,
                                               options = [],
                                               }: Props) {
    if (type === "select") {
        return (
            <div className="mb-4">
                <select
                    className="font-sans w-full bg-transparent border border-white text-white font-bold py-3 rounded-lg text-xl text-center focus:bg-black"
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                >

                    {!value && <option value="" disabled>{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option} value={option} className="text-lg">
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        );
} else {
    return (
        <div className="mb-4">
            <input
                className="w-full bg-transparent border border-white text-white font-bold py-3 rounded-lg text-xl text-center"
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                maxLength={maxLength}
            />
        </div>
    );
}
}