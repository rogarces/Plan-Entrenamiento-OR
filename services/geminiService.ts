import { UserProfile, TrainingPlan } from '../types';

export const generatePlan = async (profile: UserProfile): Promise<TrainingPlan> => {
    try {
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al comunicarse con el servidor.');
        }

        const plan: TrainingPlan = await response.json();
        return plan;

    } catch (e) {
        console.error("Error fetching from API route:", e);
        if (e instanceof Error) {
           throw new Error(`La respuesta del servidor no fue válida: ${e.message}`);
        }
        throw new Error("Ocurrió un error desconocido.");
    }
};
