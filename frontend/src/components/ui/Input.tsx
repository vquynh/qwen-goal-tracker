import React from 'react';
import ErrorMessage from './ErrorMessage';

interface InputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({
                                         id,
                                         label,
                                         value,
                                         onChange,
                                         error,
                                         type = 'text',
                                         placeholder = '',
                                         required = false
                                     }) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={placeholder}
            />
            {error && <ErrorMessage message={error} />}
        </div>
    );
};

export default Input;