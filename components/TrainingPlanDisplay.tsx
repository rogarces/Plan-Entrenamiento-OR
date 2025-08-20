
import React from 'react';
import { TrainingPlan } from '../types';
import { PrintIcon, RunIcon, RestIcon, NoteIcon } from './icons';

interface TrainingPlanDisplayProps {
    plan: TrainingPlan;
    userName: string;
}

export const TrainingPlanDisplay: React.FC<TrainingPlanDisplayProps> = ({ plan, userName }) => {

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="animate-fade-in bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 plan-printable-area">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{plan.title.replace('[Nombre]', userName)}</h2>
                    <p className="mt-2 text-md text-slate-600">Tu plan personalizado está listo. ¡A por ello!</p>
                </div>
                <button
                    id="print-button"
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 w-[220px] bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
                >
                    <PrintIcon className="h-5 w-5" />
                    <span>Imprimir / Guardar PDF</span>
                </button>
            </div>
            
            <div className="space-y-8">
                {plan.weeks.map((week) => (
                    <div key={week.week}>
                        <div className="mb-4 p-4 bg-slate-100 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-800">Semana {week.week}: <span className="font-normal">{week.period}</span></h3>
                            </div>
                            <p className="text-md font-semibold text-sky-700 mt-2 sm:mt-0">Volumen: {week.totalKm} km</p>
                        </div>

                        {week.notes && (
                            <div className="mb-4 p-3 bg-amber-100 border-l-4 border-amber-500 text-amber-800 rounded-r-lg flex items-start space-x-3">
                                <NoteIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{week.notes}</p>
                            </div>
                        )}
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold text-slate-600 w-2/12">Día</th>
                                        <th className="p-3 text-sm font-semibold text-slate-600 w-3/12">Sesión</th>
                                        <th className="p-3 text-sm font-semibold text-slate-600 w-7/12">Detalles del Entrenamiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {week.sessions.map((session, index) => (
                                        <tr key={index} className={`border-b border-slate-200 ${session.isRestDay ? 'bg-slate-50' : ''}`}>
                                            <td className="p-3 font-semibold text-slate-800 align-top">{session.day}</td>
                                            <td className="p-3 align-top">
                                                <div className={`flex items-center gap-2 font-semibold ${session.isRestDay ? 'text-slate-500' : 'text-sky-700'}`}>
                                                    {session.isRestDay ? <RestIcon className="h-5 w-5 flex-shrink-0"/> : <RunIcon className="h-5 w-5 flex-shrink-0"/>}
                                                    <span>{session.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm text-slate-600 align-top">
                                                {!session.isRestDay ? (
                                                     <div className="space-y-2">
                                                        <p><strong className="font-medium text-slate-700">Calentamiento:</strong> {session.warmup}</p>
                                                        <p><strong className="font-medium text-slate-700">Principal:</strong> {session.main}</p>
                                                        <p><strong className="font-medium text-slate-700">Vuelta a la Calma:</strong> {session.cooldown}</p>
                                                    </div>
                                                ) : <p>{session.main}</p>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Add a simple fade-in animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);