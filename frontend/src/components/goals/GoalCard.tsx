import React, { useState } from 'react';
import { Goal } from '../../types';
import ActionTable from './ActionTable';
import Input from '../ui/Input';
import DateInput from '../ui/DateInput';
import Button from '../ui/Button';
import { useGoalValidation } from '../../hooks/useFormValidation';
import { useGoals } from '../../context/GoalContext';

interface GoalCardProps {
    goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: goal.title,
        deadline: goal.deadline
    });
    const { updateGoal, deleteGoal } = useGoals();
    const { errors, validateGoal, clearErrors } = useGoalValidation();

    const handleEdit = () => {
        setIsEditing(true);
        setFormData({
            title: goal.title,
            deadline: goal.deadline
        });
        clearErrors();
    };

    const handleCancel = () => {
        setIsEditing(false);
        clearErrors();
    };

    const handleSave = async () => {
        if (validateGoal(formData)) {
            try {
                await updateGoal(goal.id, formData);
                setIsEditing(false);
            } catch (err) {
                // Errors are already handled in the context
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            await deleteGoal(goal.id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 sm:p-6">
                {isEditing ? (
                    <div className="space-y-4">
                        <Input
                            id={`goal-title-${goal.id}`}
                            label="Goal Title"
                            value={formData.title}
                            onChange={(value) => setFormData({ ...formData, title: value })}
                            error={errors.title}
                            placeholder="e.g., Complete project"
                            required={true}
                        />

                        <DateInput
                            id={`goal-deadline-${goal.id}`}
                            label="Deadline"
                            value={formData.deadline}
                            onChange={(value) => setFormData({ ...formData, deadline: value })}
                            error={errors.deadline}
                            minDate={new Date().toISOString().split('T')[0]}
                        />

                        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <Button variant="secondary" onClick={handleCancel} className="w-full sm:w-auto">
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSave} className="w-full sm:w-auto">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{goal.title}</h2>
                                <p className="text-sm text-gray-500">
                                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="mt-2 sm:mt-0 flex space-x-2">
                                <Button variant="secondary" onClick={handleEdit} size="sm">
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={handleDelete} size="sm">
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <ActionTable goalId={goal.id} actions={goal.actions} />
                    </>
                )}
            </div>
        </div>
    );
};

export default GoalCard;