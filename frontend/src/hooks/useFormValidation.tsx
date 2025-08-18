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

    // Add a new function for partial validation
    const validateField = useCallback((field: keyof ActionFormData, value: string, currentData: ActionFormData) => {
        const validationData = {
            ...currentData,
            [field]: value
        };

        // Only validate relevant fields
        if (field === 'title' && !value.trim()) {
            return 'Title is required';
        }

        if ((field === 'start_date' || field === 'end_date') &&
            validationData.start_date && validationData.end_date) {
            const startDate = new Date(validationData.start_date);
            const endDate = new Date(validationData.end_date);

            if (endDate < startDate) {
                return 'End date must be after start date';
            }
        }

        return '';
    }, []);

    return {
        errors,
        validateAction,
        validateField,
        clearErrors: () => setErrors({})
    };
};