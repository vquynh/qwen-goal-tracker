import React from 'react';
import {GoalProvider, useGoals} from './context/GoalContext';
import Header from './components/layout/Header';
import Container from './components/layout/Container';
import GoalCard from './components/goals/GoalCard';
import ErrorMessage from './components/ui/ErrorMessage';

const AppContent: React.FC = () => {
    const { goals, loading, error } = useGoals();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <>
            {error && (
                <div className="mb-4">
                    <ErrorMessage message={error} />
                </div>
            )}

            {goals.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500">No goals yet. Click the "+" button to add your first goal!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {goals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>
            )}
        </>
    );
};

const App: React.FC = () => {
    return (
        <GoalProvider>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Container>
                    <AppContent />
                </Container>
            </div>
        </GoalProvider>
    );
};

export default App;