
export interface UserProfile {
    name: string;
    age: number;
    experience: 'Principiante' | 'Intermedio' | 'Avanzado';
    paceMinutes: number;
    paceSeconds: number;
    trainingDays: number;
    environment: string;
    tools: string;
    health: string;
    goalRace: '5k' | '10k' | '21k' | '42k';
    goalRaceDate: string; // YYYY-MM-DD
    goalTimeHours: number;
    goalTimeMinutes: number;
}

export interface DailySession {
    day: string;
    title: string;
    warmup: string;
    main: string;
    cooldown: string;
    isRestDay: boolean;
}

export interface WeeklyPlan {
    week: number;
    period: string;
    totalKm: number;
    sessions: DailySession[];
    notes?: string;
}

export interface TrainingPlan {
    title: string;
    weeks: WeeklyPlan[];
}
