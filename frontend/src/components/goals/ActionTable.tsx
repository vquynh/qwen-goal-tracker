import React, { useState } from 'react';
import { Action, ActionFormData } from '../../types';
import { useActionValidation } from '../../hooks/useFormValidation';
import Input from '../ui/Input';
import DateInput from '../ui/DateInput';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useGoals } from '../../context/GoalContext';

interface ActionTableProps {
    goalId: string;
    actions: Action[];
}

const ActionTable: React.FC<ActionTableProps> = ({ goalId, actions }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<ActionFormData>({
        title: '',
        start_date: '',
        end_date: '',
        interval: 'daily'
    });
    const { createAction, updateAction, deleteAction } = useGoals();
    const {
        errors,
        fieldErrors,
        validateAction,
        validateField,
        setFieldError,
        clearFieldError,
        clearErrors
    } = useActionValidation();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateAction(formData)) {
            try {
                await createAction(goalId, formData);
                setIsAdding(false);
                setFormData({
                    title: '',
                    start_date: '',
                    end_date: '',
                    interval: 'daily'
                });
                clearErrors();
            } catch (err) {
                // Errors are already handled in the context
            }
        }
    };

    const handleUpdate = async (actionId: string, field: keyof ActionFormData, value: string) => {
        const currentAction = actions.find(a => a.id === actionId);
        if (!currentAction) return;

        // For date fields, do field-specific validation
        if (field === 'start_date' || field === 'end_date') {
            const validationData = {
                title: currentAction.title,
                start_date: field === 'start_date' ? value : currentAction.start_date,
                end_date: field === 'end_date' ? value : currentAction.end_date,
                interval: currentAction.interval
            };

            const error = validateField(field, value, validationData);
            const errorKey = `${actionId}-${field}`;

            if (error) {
                setFieldError(errorKey, error);
            } else {
                clearFieldError(errorKey);
            }

            if (error) {
                return;
            }
        }

        // Proceed with the update
        try {
            await updateAction(actionId, { [field]: value });

            // Clear field-specific error after successful update
            clearFieldError(`${actionId}-${field}`);
        } catch (err) {
            // Errors are handled in context
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setFormData({
            title: '',
            start_date: '',
            end_date: '',
            interval: 'daily'
        });
        clearErrors();
    };

    return (
        <div className="mt-4">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Start Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            End Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interval
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {actions.map(action => (
                        <tr key={action.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Input
                                    id={`action-title-${action.id}`}
                                    label=""
                                    value={action.title}
                                    onChange={(value) => handleUpdate(action.id, 'title', value)}
                                    error={errors.title}
                                    placeholder="Action title"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <DateInput
                                    id={`action-start-${action.id}`}
                                    label=""
                                    value={action.start_date}
                                    onChange={(value) => handleUpdate(action.id, 'start_date', value)}
                                    error={errors.start_date}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <DateInput
                                    id={`action-end-${action.id}`}
                                    label=""
                                    value={action.end_date}
                                    onChange={(value) => handleUpdate(action.id, 'end_date', value)}
                                    error={errors.end_date}
                                    minDate={action.start_date}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Select
                                    id={`action-interval-${action.id}`}
                                    label=""
                                    value={action.interval}
                                    onChange={(value) => handleUpdate(action.id, 'interval', value)}
                                    options={[
                                        { value: 'daily', label: 'Daily' },
                                        { value: 'weekly', label: 'Weekly' },
                                        { value: 'monthly', label: 'Monthly' }
                                    ]}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isAdding ? (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Action</h3>
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="action-title"
                            label="Title"
                            value={formData.title}
                            onChange={(value) => setFormData({ ...formData, title: value })}
                            error={errors.title}
                            placeholder="e.g., Daily workout"
                            required={true}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DateInput
                                id="action-start"
                                label="Start Date"
                                value={formData.start_date}
                                onChange={(value) => setFormData({ ...formData, start_date: value })}
                                error={errors.start_date}
                                minDate={new Date().toISOString().split('T')[0]}
                            />

                            <DateInput
                                id="action-end"
                                label="End Date"
                                value={formData.end_date}
                                onChange={(value) => setFormData({ ...formData, end_date: value })}
                                error={errors.end_date}
                                minDate={formData.start_date || new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <Select
                            id="action-interval"
                            label="Interval"
                            value={formData.interval}
                            onChange={(value) => setFormData({ ...formData, interval: value as 'daily' | 'weekly' | 'monthly' })}
                            options={[
                                { value: 'daily', label: 'Daily' },
                                { value: 'weekly', label: 'Weekly' },
                                { value: 'monthly', label: 'Monthly' }
                            ]}
                        />

                        <div className="mt-4 flex justify-end space-x-3">
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Add Action
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <Button
                    variant="add"
                    onClick={() => setIsAdding(true)}
                    className="mt-4"
                >
                    <span className="text-xl">+</span> Add Action
                </Button>
            )}
        </div>
    );
};

export default ActionTable;