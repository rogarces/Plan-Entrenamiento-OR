
import React, { useState, useCallback } from 'react';
import { UserProfile, TrainingPlan } from './types';
import { generatePlan } from './services/geminiService';
import { ProfileForm } from './components/ProfileForm';
import { TrainingPlanDisplay } from './components/TrainingPlanDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + 90)).toISOString().split('T')[0];

    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Corredor/a',
        age: 38,
        experience: 'Principiante',
        paceMinutes: 5,
        paceSeconds: 30,
        trainingDays: 5,
        environment: 'Urbano (calles, parques) con acceso a pista de atletismo.',
        tools: 'Reloj deportivo con datos de ritmo, frecuencia cardiaca, altimetría.',
        health: 'Sin lesiones, enfermedades o condiciones que afecten el rendimiento.',
        goalRace: '21k',
        goalRaceDate: futureDate,
        goalTimeHours: 1,
        goalTimeMinutes: 50,
    });

    const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
    const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = useCallback(async () => {
        setLoadingState('loading');
        setError(null);
        setTrainingPlan(null);
        try {
            const plan = await generatePlan(userProfile);
            setTrainingPlan(plan);
            setLoadingState('success');
        } catch (err) {
            console.error(err);
            setError('Hubo un error al generar el plan. Por favor, revisa tus datos e inténtalo de nuevo.');
            setLoadingState('error');
        }
    }, [userProfile]);

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-3">
                    <LogoIcon className="h-8 w-8 text-sky-600" />
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Generador de Planes de Running
                    </h1>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <div id="form-container">
                        <ProfileForm 
                            userProfile={userProfile} 
                            setUserProfile={setUserProfile}
                            onGenerate={handleGeneratePlan}
                            isLoading={loadingState === 'loading'}
                        />
                    </div>

                    <div className="mt-10">
                        {loadingState === 'loading' && <LoadingSpinner />}
                        {loadingState === 'error' && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {loadingState === 'success' && trainingPlan && (
                           <TrainingPlanDisplay plan={trainingPlan} userName={userProfile.name} />
                        )}
                    </div>
                </div>
            </main>
             <footer className="text-center py-6 mt-8 text-sm text-slate-500">
                <p>Potenciado por Gemini API. Creado para corredores ambiciosos.</p>
            </footer>
        </div>
    );
};

export default App;
