import { useState, useCallback } from 'react';
import { GoalFormData, ActionFormData } from '../types';

export const useGoalValidation = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateGoal = useCallback((formData: GoalFormData) => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.deadline) {
            newErrors.deadline = 'Deadline is required';
        } else {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (deadlineDate < today) {
                newErrors.deadline = 'Deadline must be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, []);

    return {
        errors,
        validateGoal,
        clearErrors: () => setErrors({})
    };
};

export const useActionValidation = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Clear all errors
    const clearErrors = () => {
        setErrors({});
        setFieldErrors({});
    };

    // Clear errors for a specific field
    const clearFieldError = (field: string) => {
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    // Set error for a specific field
    const setFieldError = (field: string, message: string) => {
        setFieldErrors(prev => ({
            ...prev,
            [field]: message
        }));
    };

    // Full form validation (for creating new actions)
    const validateAction = useCallback((formData: ActionFormData) => {
        const newErrors: Record<string, string> = {};

        if (!formData.title?.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.start_date) {
            newErrors.start_date = 'Start date is required';
        }

        if (!formData.end_date) {
            newErrors.end_date = 'End date is required';
        }

        if (formData.start_date && formData.end_date) {
            const startDate = new Date(formData.start_date);
            const endDate = new Date(formData.end_date);

            if (endDate < startDate) {
                newErrors.end_date = 'End date must be after start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, []);

    // Field-specific validation
    const validateField = useCallback((
        field: keyof ActionFormData,
        value: string,
        currentData: ActionFormData
    ) => {
        // Only validate relevant fields
        if (field === 'title' && !value.trim()) {
            return 'Title is required';
        }

        if ((field === 'start_date' || field === 'end_date') &&
            currentData.start_date && currentData.end_date) {
            const startDate = new Date(
                field === 'start_date' ? value : currentData.start_date
            );
            const endDate = new Date(
                field === 'end_date' ? value : currentData.end_date
            );

            if (endDate < startDate) {
                return 'End date must be after start date';
            }
        }

        return '';
    }, []);

    return {
        errors,
        fieldErrors,
        validateAction,
        validateField,
        setFieldError,
        clearFieldError,
        clearErrors
    };
};