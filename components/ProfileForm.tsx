import React from 'react';
import { UserProfile } from '../types';
import { UserIcon, RunningIcon, TrophyIcon, SpeedIcon } from './icons';

interface ProfileFormProps {
    userProfile: UserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
    onGenerate: () => void;
    isLoading: boolean;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-slate-700 ml-3">{title}</h3>
        </div>
        {children}
    </div>
);

const ChoiceButton: React.FC<{ value: string; label: string; selectedValue: string; onChange: (value: any) => void; }> = ({ value, label, selectedValue, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(value)}
        className={`flex-1 text-center py-3 px-2 rounded-md font-semibold transition-all duration-200 border-2 ${selectedValue === value ? 'bg-sky-600 text-white border-sky-600 shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent'}`}
    >
        {label}
    </button>
);


export const ProfileForm: React.FC<ProfileFormProps> = ({ userProfile, setUserProfile, onGenerate, isLoading }) => {
    
    const handleChange = <T,>(field: keyof UserProfile, value: T) => {
        setUserProfile(prev => ({ ...prev, [field]: value }));
    };

    const inputClass = "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200";
    const numberInputClass = `${inputClass} text-center`;

    return (
        <div className="space-y-8">
            <Section title="Sobre Ti" icon={<UserIcon className="h-6 w-6 text-sky-600" />}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Tu Nombre</label>
                        <input type="text" value={userProfile.name} onChange={e => handleChange('name', e.target.value)} className={inputClass} placeholder="Ej: Alex"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Edad</label>
                        <input type="number" value={userProfile.age} onChange={e => handleChange('age', parseInt(e.target.value))} className={inputClass} />
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Nivel de Experiencia</label>
                        <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
                           <ChoiceButton value="Principiante" label="Principiante" selectedValue={userProfile.experience} onChange={v => handleChange('experience', v)} />
                           <ChoiceButton value="Intermedio" label="Intermedio" selectedValue={userProfile.experience} onChange={v => handleChange('experience', v)} />
                           <ChoiceButton value="Avanzado" label="Avanzado" selectedValue={userProfile.experience} onChange={v => handleChange('experience', v)} />
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Tu Ritmo y Disponibilidad" icon={<SpeedIcon className="h-6 w-6 text-sky-600" />}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Ritmo Cómodo (min/km)</label>
                        <div className="flex items-center space-x-2">
                            <input type="number" min="3" max="10" value={userProfile.paceMinutes} onChange={e => handleChange('paceMinutes', parseInt(e.target.value))} className={numberInputClass} />
                            <span className="font-bold text-slate-500">:</span>
                            <input type="number" min="0" max="59" step="5" value={userProfile.paceSeconds} onChange={e => handleChange('paceSeconds', parseInt(e.target.value))} className={numberInputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Días de Entrenamiento / Semana</label>
                         <input type="number" min="2" max="7" value={userProfile.trainingDays} onChange={e => handleChange('trainingDays', parseInt(e.target.value))} className={inputClass} />
                    </div>
                </div>
            </Section>

            <Section title="Tu Meta" icon={<TrophyIcon className="h-6 w-6 text-sky-600" />}>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Distancia Objetivo</label>
                        <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-lg">
                           <ChoiceButton value="5k" label="5k" selectedValue={userProfile.goalRace} onChange={v => handleChange('goalRace', v)} />
                           <ChoiceButton value="10k" label="10k" selectedValue={userProfile.goalRace} onChange={v => handleChange('goalRace', v)} />
                           <ChoiceButton value="21k" label="21k" selectedValue={userProfile.goalRace} onChange={v => handleChange('goalRace', v)} />
                           <ChoiceButton value="42k" label="42k" selectedValue={userProfile.goalRace} onChange={v => handleChange('goalRace', v)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-slate-600 mb-1">Fecha de la Carrera</label>
                             <input type="date" value={userProfile.goalRaceDate} onChange={e => handleChange('goalRaceDate', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Tiempo Objetivo</label>
                             <div className="flex items-center space-x-2">
                                <input type="number" min="0" max="10" value={userProfile.goalTimeHours} onChange={e => handleChange('goalTimeHours', parseInt(e.target.value))} className={numberInputClass} placeholder="HH" />
                                <span className="font-bold text-slate-500">:</span>
                                <input type="number" min="0" max="59" value={userProfile.goalTimeMinutes} onChange={e => handleChange('goalTimeMinutes', parseInt(e.target.value))} className={numberInputClass} placeholder="MM" />
                            </div>
                        </div>
                    </div>
                 </div>
            </Section>
            
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full mt-6 bg-sky-600 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
            >
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generando Plan...</span>
                    </>
                ) : (
                    <>
                        <RunningIcon className="h-5 w-5" />
                        <span>Generar Mi Plan de Entrenamiento</span>
                    </>
                )}
            </button>
        </div>
    );
};