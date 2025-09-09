import React, { useState } from 'react';
import { Goal, Action } from '../../types';
import { useGoals } from '../../context/GoalContext';
import { safeParseDate, formatDateForInput } from '../../utils/dateUtils';

interface GoalCardProps {
    goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
    const { updateAction, deleteAction, updateGoal, createAction } = useGoals();
    const [isEditing, setIsEditing] = useState(false);
    const [goalFormData, setGoalFormData] = useState({
        title: goal.title,
        deadline: goal.deadline
    });

    // Renamed from formData to goalFormData for clarity
    const { title, deadline } = goalFormData;

    // Toggle action status between pending/completed
    const handleToggleStatus = async (actionId: string) => {
        try {
            const currentAction = goal.actions.find(a => a.id === actionId);
            const newStatus = currentAction?.status === 'completed' ? 'pending' : 'completed';

            await updateAction(actionId, { status: newStatus });
        } catch (error) {
            console.error('Failed to update action status:', error);
        }
    };

    // Handle updates to action fields
    const handleUpdate = async (actionId: string, field: keyof Action, value: string) => {
        try {
            const updates: Partial<Action> = { [field]: value };

            // Special handling for date fields to ensure proper validation
            if (field === 'start_date' || field === 'end_date') {
                const currentAction = goal.actions.find(a => a.id === actionId);
                if (!currentAction) return;

                const startDate = field === 'start_date' ? value : currentAction.start_date;
                const endDate = field === 'end_date' ? value : currentAction.end_date;

                const parsedStartDate = safeParseDate(startDate);
                const parsedEndDate = safeParseDate(endDate);

                if (parsedStartDate && parsedEndDate && parsedEndDate < parsedStartDate) {
                    alert('End date must be after start date');
                    return;
                }
            }

            await updateAction(actionId, updates);
        } catch (error) {
            console.error('Failed to update action:', error);
        }
    };

    // Delete an action
    const handleDeleteAction = async (actionId: string) => {
        if (window.confirm('Are you sure you want to delete this action?')) {
            try {
                await deleteAction(actionId, goal.id);
            } catch (error) {
                console.error('Failed to delete action:', error);
            }
        }
    };

    // Save edits made in edit mode
    const handleSaveEdits = async () => {
        try {
            // Update goal title and deadline if they changed
            if (title !== goal.title || deadline !== goal.deadline) {
                await updateGoal(goal.id, goalFormData);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save goal edits:', error);
        }
    };

    // Add a new action - simplified without trying to reset child form state
    const handleAddAction = async (actionData: {
        title: string;
        start_date: string;
        end_date: string;
        interval: string;
    }) => {
        try {
            await createAction(goal.id, {
                title: actionData.title,
                start_date: actionData.start_date,
                end_date: actionData.end_date,
                interval: actionData.interval as 'daily' | 'weekly' | 'monthly',
                status: 'pending'
            });
        } catch (error) {
            console.error('Failed to add action:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-all duration-300">
            {/* Goal Header */}
            <div className="bg-yellow-500 text-white p-4">
                {isEditing ? (
                    <div className="flex flex-col space-y-2">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setGoalFormData({...goalFormData, title: e.target.value})}
                            className="w-full px-3 py-2 rounded-md text-gray-900"
                        />
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setGoalFormData({...goalFormData, deadline: e.target.value})}
                                min={new Date().toISOString().split('T')[0]}
                                className="px-3 py-2 rounded-md text-gray-900"
                            />
                            <button
                                onClick={handleSaveEdits}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{goal.title}</h2>
                        <div className="flex space-x-2">
              <span className="bg-white text-yellow-500 px-2 py-1 rounded text-sm">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </span>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-white text-yellow-500 px-3 py-1 rounded hover:bg-gray-100"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                        {isEditing && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                        )}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {goal.actions.map(action => (
                        <tr key={action.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={action.status === 'completed'}
                                        onChange={() => handleToggleStatus(action.id)}
                                        className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className={action.status === 'completed' ? 'line-through text-gray-400' : ''}>
                      {action.title}
                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={formatDateForInput(action.start_date)}
                                        onChange={(e) => handleUpdate(action.id, 'start_date', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded"
                                    />
                                ) : (
                                    formatDateForInput(action.start_date)
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={formatDateForInput(action.end_date)}
                                        onChange={(e) => handleUpdate(action.id, 'end_date', e.target.value)}
                                        min={formatDateForInput(action.start_date)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded"
                                    />
                                ) : (
                                    formatDateForInput(action.end_date)
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {isEditing ? (
                                    <select
                                        className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 w-full"
                                        value={action.status || ''}
                                        onChange={(e) => handleUpdate(action.id, 'status', e.target.value)}
                                    >
                                        <option value="">Select result</option>
                                        <option value="Done">Done</option>
                                        <option value="In progress">In progress</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                ) : (
                                    action.status || '-'
                                )}
                            </td>
                            {isEditing && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDeleteAction(action.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Add Action Form */}
            {isEditing && (
                <div className="p-4 bg-gray-50">
                    <AddActionForm onAdd={handleAddAction} />
                </div>
            )}
        </div>
    );
};

// Add Action Form Component
interface AddActionFormProps {
    onAdd: (action: {
        title: string;
        start_date: string;
        end_date: string;
        interval: string;
    }) => Promise<void>;
}

const AddActionForm: React.FC<AddActionFormProps> = ({ onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        start_date: '',
        end_date: '',
        interval: 'weekly'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.start_date || !formData.end_date) {
            alert('Please fill in all required fields');
            return;
        }

        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);

        if (endDate < startDate) {
            alert('End date must be after start date');
            return;
        }

        try {
            await onAdd(formData);

            // Reset form AFTER successful API call
            setFormData({
                title: '',
                start_date: '',
                end_date: '',
                interval: 'weekly'
            });
        } catch (error) {
            console.error('Failed to add action:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    placeholder="Action title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <select
                    value={formData.interval}
                    onChange={(e) => setFormData({...formData, interval: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Add Action
                </button>
            </div>
        </form>
    );
};

export default GoalCard;