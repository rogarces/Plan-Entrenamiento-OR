
import React, { useState, useEffect } from 'react';

const messages = [
    "Analizando tu perfil de corredor...",
    "Consultando a los mejores entrenadores virtuales...",
    "Estructurando tus semanas de entrenamiento...",
    "Calculando ritmos y distancias...",
    "Añadiendo días de descanso para una óptima recuperación...",
    "¡Casi listo! Preparando tu camino a la meta..."
];

export const LoadingSpinner: React.FC = () => {
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = messages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="text-center p-8 space-y-4">
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
            <p className="text-slate-600 font-medium text-lg animate-pulse">{message}</p>
        </div>
    );
};
