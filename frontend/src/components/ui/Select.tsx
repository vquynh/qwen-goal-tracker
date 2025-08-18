import React from 'react';
import ErrorMessage from './ErrorMessage';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    error?: string;
    required?: boolean;
}

const Select: React.FC<SelectProps> = ({
                                           id,
                                           label,
                                           value,
                                           onChange,
                                           options,
                                           error,
                                           required = false
                                       }) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <ErrorMessage message={error} />}
        </div>
    );
};

export default Select;