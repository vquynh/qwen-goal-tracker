import React, { useState } from 'react';
import { GoalFormData } from '../../types';
import { useGoalValidation } from '../../hooks/useFormValidation';
import Input from '../ui/Input';
import DateInput from '../ui/DateInput';
import Button from '../ui/Button';
import { useGoals } from '../../context/GoalContext';

const AddGoalButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<GoalFormData>({
        title: '',
        deadline: ''
    });
    const { createGoal } = useGoals();
    const { errors, validateGoal, clearErrors } = useGoalValidation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateGoal(formData)) {
            try {
                await createGoal(formData);
                setIsOpen(false);
                setFormData({ title: '', deadline: '' });
                clearErrors();
            } catch (err) {
                // Errors are already handled in the context
            }
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setFormData({ title: '', deadline: '' });
        clearErrors();
    };

    if (isOpen) {
        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
                <div className="relative top-1/4 w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Goal</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="goal-title"
                            label="Goal Title"
                            value={formData.title}
                            onChange={(value) => setFormData({ ...formData, title: value })}
                            error={errors.title}
                            placeholder="e.g., Complete project"
                            required={true}
                        />

                        <DateInput
                            id="goal-deadline"
                            label="Deadline"
                            value={formData.deadline}
                            onChange={(value) => setFormData({ ...formData, deadline: value })}
                            error={errors.deadline}
                            minDate={new Date().toISOString().split('T')[0]}
                        />

                        <div className="mt-6 flex justify-end space-x-3">
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Create Goal
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <Button variant="add" onClick={() => setIsOpen(true)}>
            <span className="text-xl">+</span> Add Goal
        </Button>
    );
};

export default AddGoalButton;