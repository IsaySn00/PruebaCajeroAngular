export interface Result<T = any>{
    correct: boolean;
    status: number;
    errorMessage?: string;
    object?: T,
    objects?: [T]
}