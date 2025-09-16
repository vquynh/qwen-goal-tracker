import React, { useState, useContext } from 'react';
import { Goal, Action } from '../../types';
import { useGoals } from '../../context/GoalContext';
import { safeParseDate, formatDateForInput } from '../../utils/dateUtils';
import { PlusIcon, PencilIcon, CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

interface GoalCardProps {
    goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
    const { updateAction, deleteAction, updateGoal, createAction } = useGoals();
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [isAddingAction, setIsAddingAction] = useState(false);
    const [editingActionId, setEditingActionId] = useState<string | null>(null);
    const [goalFormData, setGoalFormData] = useState({
        title: goal.title,
        deadline: goal.deadline
    });
    const [actionFormData, setActionFormData] = useState({
        title: '',
        start_date: '',
        end_date: '',
        interval: 'once',
        status: 'pending'
    });
    const [editingActionData, setEditingActionData] = useState<Action | null>(null);

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

    // Enter edit mode for an action
    const handleEditAction = (action: Action) => {
        setEditingActionId(action.id);
        setEditingActionData({ ...action });
    };

    // Handle updates to action fields during editing
    const handleEditingActionChange = (field: keyof Action, value: string) => {
        if (editingActionData) {
            setEditingActionData({
                ...editingActionData,
                [field]: value
            });
        }
    };

    // Save edited action
    const handleSaveEditedAction = async () => {
        if (!editingActionData) return;

        try {
            // Validate dates
            const startDate = safeParseDate(editingActionData.start_date);
            const endDate = safeParseDate(editingActionData.end_date);

            if (startDate && endDate && endDate < startDate) {
                alert('End date must be after start date');
                return;
            }

            // Save the updated action
            await updateAction(editingActionData.id, {
                title: editingActionData.title,
                start_date: editingActionData.start_date,
                end_date: editingActionData.end_date,
                interval: editingActionData.interval,
                status: editingActionData.status
            });

            // Exit edit mode
            setEditingActionId(null);
            setEditingActionData(null);
        } catch (error) {
            console.error('Failed to save edited action:', error);
        }
    };

    // Cancel action editing
    const handleCancelActionEdit = () => {
        setEditingActionId(null);
        setEditingActionData(null);
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
            if (goalFormData.title !== goal.title || goalFormData.deadline !== goal.deadline) {
                await updateGoal(goal.id, goalFormData);
            }
            setIsEditingGoal(false);
        } catch (error) {
            console.error('Failed to save goal edits:', error);
        }
    };

    // Cancel goal edits
    const handleCancelGoalEdits = () => {
        setIsEditingGoal(false);
        setGoalFormData({
            title: goal.title,
            deadline: goal.deadline
        });
    };

    // Add a new action
    const handleAddAction = async () => {
        try {
            // Validate form data
            if (!actionFormData.title.trim() || !actionFormData.start_date || !actionFormData.end_date) {
                alert('Please fill in all required fields');
                return;
            }

            const startDate = new Date(actionFormData.start_date);
            const endDate = new Date(actionFormData.end_date);

            if (endDate < startDate) {
                alert('End date must be after start date');
                return;
            }

            // Create the action
            await createAction(goal.id, {
                title: actionFormData.title,
                start_date: actionFormData.start_date,
                end_date: actionFormData.end_date,
                interval: actionFormData.interval as 'once' | 'daily' | 'weekly' | 'monthly',
                status: 'pending'
            });

            // Reset form and close the action form
            setActionFormData({
                title: '',
                start_date: '',
                end_date: '',
                interval: 'once',
                status: 'pending',
            });
            setIsAddingAction(false);
        } catch (error) {
            console.error('Failed to add action:', error);
        }
    };

    // Cancel adding action
    const handleCancelAddAction = () => {
        setActionFormData({
            title: '',
            start_date: '',
            end_date: '',
            interval: 'once',
            status: 'pending',
        });
        setIsAddingAction(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-all duration-300 relative">
            {/* Goal Header */}
            <div className="bg-yellow-400 text-white p-4">
                {isEditingGoal ? (
                    <div className="flex flex-col space-y-2">
                        <input
                            type="text"
                            value={goalFormData.title}
                            onChange={(e) => setGoalFormData({...goalFormData, title: e.target.value})}
                            className="w-full px-3 py-2 rounded-md text-gray-900"
                        />
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                value={goalFormData.deadline}
                                onChange={(e) => setGoalFormData({...goalFormData, deadline: e.target.value})}
                                min={new Date().toISOString().split('T')[0]}
                                className="px-3 py-2 rounded-md text-gray-900"
                            />
                            <button
                                onClick={handleSaveEdits}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                            >
                                <CheckIcon className="h-5 w-5 mr-1" />
                                Save
                            </button>
                            <button
                                onClick={handleCancelGoalEdits}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                            >
                                <XMarkIcon className="h-5 w-5 mr-1" />
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
                                onClick={() => setIsEditingGoal(true)}
                                className="bg-white text-yellow-500 p-2 rounded hover:bg-gray-100"
                                aria-label="Edit goal"
                            >
                                <PencilIcon className="h-5 w-5" />
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interval</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {goal.actions.map(action => {
                        const isEditing = editingActionId === action.id;

                        return (
                            <tr
                                key={action.id}
                                className={`hover:bg-gray-50 transition-colors ${isEditing ? 'bg-blue-50' : ''}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {isEditing ? (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={editingActionData?.status === 'completed'}
                                                onChange={(e) =>
                                                    handleEditingActionChange('status', e.target.checked ? 'completed' : 'pending')
                                                }
                                                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <input
                                                type="text"
                                                value={editingActionData?.title || ''}
                                                onChange={(e) => handleEditingActionChange('title', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center"
                                            onClick={() => handleEditAction(action)}
                                            style={{ cursor: 'pointer' }}
                                        >
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
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={formatDateForInput(editingActionData?.start_date || '')}
                                            onChange={(e) => handleEditingActionChange('start_date', e.target.value)}
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
                                            value={formatDateForInput(editingActionData?.end_date || '')}
                                            onChange={(e) => handleEditingActionChange('end_date', e.target.value)}
                                            min={formatDateForInput(editingActionData?.start_date || '')}
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        formatDateForInput(action.end_date)
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {isEditing ? (
                                        <div className="flex items-center space-x-2">
                                            <select
                                                className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 w-full"
                                                value={editingActionData?.status || ''}
                                                onChange={(e) => handleEditingActionChange('status', e.target.value)}
                                            >
                                                <option value="">Select status</option>
                                                <option value="pending">Pending</option>
                                                <option value="inprogress">In progress</option>
                                                <option value="done">Done</option>
                                                <option value="overdue">Overdue</option>
                                            </select>
                                        </div>
                                    ) : (
                                        action.status || '-'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {isEditing ? (
                                        <div className="flex items-center space-x-2">
                                            <select
                                                className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 w-full"
                                                value={editingActionData?.interval || ''}
                                                onChange={(e) => handleEditingActionChange('interval', e.target.value)}
                                            >
                                                <option value="">Select interval</option>
                                                <option value="once">Once</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="biweekly">Biweekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={handleSaveEditedAction}
                                                    className="text-green-600 hover:text-green-800 p-1"
                                                    title="Save changes"
                                                >
                                                    <CheckIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={handleCancelActionEdit}
                                                    className="text-gray-600 hover:text-gray-800 p-1"
                                                    title="Cancel editing"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAction(action.id)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                    title="Delete action"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        action.interval || 'once'
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Add Action Form */}
            {isAddingAction && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Action title"
                            value={actionFormData.title}
                            onChange={(e) => setActionFormData({...actionFormData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <select
                            value={actionFormData.interval}
                            onChange={(e) => setActionFormData({...actionFormData, interval: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="once">Once</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Biweekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <input
                            type="date"
                            value={actionFormData.start_date}
                            onChange={(e) => setActionFormData({...actionFormData, start_date: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="date"
                            value={actionFormData.end_date}
                            onChange={(e) => setActionFormData({...actionFormData, end_date: e.target.value})}
                            min={actionFormData.start_date || new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <select
                            value={actionFormData.status}
                            onChange={(e) => setActionFormData({...actionFormData, status: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select status</option>
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleCancelAddAction}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddAction}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Add Action
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Add Action Button */}
            <div className="absolute bottom-4 right-4">
                {!isAddingAction ? (
                    <button
                        onClick={() => setIsAddingAction(true)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
                        aria-label="Add new action"
                    >
                        <PlusIcon className="h-6 w-6" />
                    </button>
                ) : (
                    <button
                        onClick={handleAddAction}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-200 flex items-center"
                    >
                        <CheckIcon className="h-5 w-5 mr-1" />
                        Add Action
                    </button>
                )}
            </div>
        </div>
    );
};

export default GoalCard;