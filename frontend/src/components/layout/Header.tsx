import React from 'react';
import AddGoalButton from '../goals/AddGoalButton';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Goal Tracker</h1>
                    <AddGoalButton />
                </div>
            </div>
        </header>
    );
};

export default Header;