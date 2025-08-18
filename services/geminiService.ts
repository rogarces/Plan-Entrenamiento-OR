
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, TrainingPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const planSchema = {
    type: Type.OBJECT,
    properties: {
        title: { 
            type: Type.STRING,
            description: "Un título motivador para el plan de entrenamiento que incluya el nombre del corredor. Ejemplo: 'El Camino de [Nombre] hacia la Maratón: Plan Sub 4h'"
        },
        weeks: {
            type: Type.ARRAY,
            description: "Un array de objetos, donde cada objeto representa una semana de entrenamiento.",
            items: {
                type: Type.OBJECT,
                properties: {
                    week: { type: Type.NUMBER, description: "El número de la semana en el plan (e.g., 1, 2, 3)." },
                    period: { type: Type.STRING, description: "El enfoque de la semana (e.g., 'Base Aeróbica', 'Intensidad', 'Tapering')." },
                    totalKm: { type: Type.NUMBER, description: "El volumen total de kilómetros para la semana." },
                    sessions: {
                        type: Type.ARRAY,
                        description: "Un array de objetos, cada uno representando una sesión de entrenamiento diaria. Deberían coincidir con el número de días de entrenamiento solicitados, más los días de descanso.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                day: { type: Type.STRING, description: "El día de la semana (e.g., 'Lunes', 'Martes')." },
                                title: { type: Type.STRING, description: "El título de la sesión (e.g., 'Rodaje Suave', 'Series en Pista', 'Descanso')." },
                                warmup: { type: Type.STRING, description: "Descripción detallada del calentamiento. Si es día de descanso, poner 'N/A'." },
                                main: { type: Type.STRING, description: "Descripción detallada paso a paso de la parte principal de la sesión, incluyendo distancias, ritmos (en min/km), tiempos, o zonas de FC. Si es día de descanso, poner 'Descanso activo o total'." },
                                cooldown: { type: Type.STRING, description: "Descripción detallada de la vuelta a la calma. Si es día de descanso, poner 'N/A'." },
                                isRestDay: { type: Type.BOOLEAN, description: "True si el día es de descanso completo o activo, false si hay entrenamiento estructurado." },
                            },
                             required: ["day", "title", "warmup", "main", "cooldown", "isRestDay"]
                        }
                    },
                    notes: { type: Type.STRING, description: "Notas opcionales para la semana, como 'Agendar sesión de masajes este fin de semana' o 'Semana de descarga'."}
                },
                required: ["week", "period", "totalKm", "sessions"]
            }
        }
    },
    required: ["title", "weeks"]
};


const buildPrompt = (profile: UserProfile): string => {
    const goalRaceMap = {
        '5k': '5k',
        '10k': '10k',
        '21k': 'Media Maratón (21k)',
        '42k': 'Maratón (42k)'
    };

    const goalTimeStr = `${profile.goalTimeHours > 0 ? `${profile.goalTimeHours}h ` : ''}${profile.goalTimeMinutes}min`;

    return `
    Eres un entrenador de running de élite, experto en crear planes para corredores aficionados de todos los niveles.
    Tu tarea es crear un plan de entrenamiento detallado y personalizado para un corredor con las siguientes características:

    - **Nombre:** ${profile.name}
    - **Edad:** ${profile.age} años
    - **Nivel de Experiencia:** ${profile.experience}
    - **Ritmo de Carrera Cómodo (aproximado):** ${profile.paceMinutes}:${String(profile.paceSeconds).padStart(2, '0')} min/km
    - **Disponibilidad:** ${profile.trainingDays} días a la semana.
    - **Entorno:** ${profile.environment}
    - **Herramientas:** ${profile.tools}
    - **Salud:** ${profile.health}
    - **Objetivo Principal:** Correr una carrera de ${goalRaceMap[profile.goalRace]}
    - **Fecha del Evento:** ${profile.goalRaceDate}
    - **Tiempo Objetivo:** ${goalTimeStr}

    **Instrucciones Clave para el Plan:**
    1.  Calcula la duración del plan (generalmente 8-10 semanas para 5k/10k, 12-16 semanas para 21k/42k) para que termine justo en la fecha del evento: ${profile.goalRaceDate}.
    2.  Diseña el plan semana a semana, con el número de sesiones por semana que coincida con la disponibilidad del corredor (${profile.trainingDays} días de entrenamiento + días de descanso).
    3.  Para cada sesión, detalla:
        - **Calentamiento:** (e.g., '15 min de trote suave + movilidad articular y 4x50m progresivos').
        - **Desarrollo (Parte Principal):** Sé extremadamente preciso. Especifica distancias, ritmos en min/km, tiempos, recuperaciones y/o zonas de Frecuencia Cardíaca (Z2, Z3, etc.). Ejemplo: '4x1000m a 5:10 min/km con 400m de recuperación al trote'.
        - **Vuelta a la Calma:** (e.g., '10 min de trote muy suave + 15 min de estiramientos enfocados en piernas y glúteos').
    4.  Para los días de descanso, indícalo claramente. Pueden ser descanso total o activo (caminata, yoga suave).
    5.  Al final de cada semana, calcula y especifica el volumen total de kilómetros.
    6.  Recomienda estratégicamente sesiones de masajes, fisioterapia o foam roller, especialmente después de semanas de alta carga o entrenamientos largos.
    7.  La estructura de la respuesta debe ser estrictamente un objeto JSON que se ajuste al esquema proporcionado. No incluyas ningún texto, explicación, o markdown fuera del objeto JSON. El plan debe ser realista y seguro para el nivel de experiencia del corredor.
    `;
};


export const generatePlan = async (profile: UserProfile): Promise<TrainingPlan> => {
    const prompt = buildPrompt(profile);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: planSchema,
            temperature: 0.4,
        }
    });

    try {
        const jsonText = response.text.trim();
        const plan: TrainingPlan = JSON.parse(jsonText);
        return plan;
    } catch (e) {
        console.error("Error parsing JSON response from Gemini:", response.text);
        throw new Error("La respuesta de la API no tenía el formato JSON esperado.");
    }
};
