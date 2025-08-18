import React from 'react';
import Input from './Input';

interface DateInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    minDate?: string;
}

const DateInput: React.FC<DateInputProps> = ({
                                                 id,
                                                 label,
                                                 value,
                                                 onChange,
                                                 error,
                                                 minDate
                                             }) => {
    return (
        <Input
            id={id}
            label={label}
            value={value}
            onChange={onChange}
            error={error}
            type="date"
            required={true}
            min={minDate}
        />
    );
};

export default DateInput;