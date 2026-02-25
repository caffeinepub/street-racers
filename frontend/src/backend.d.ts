import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScoreEntry {
    car: CarType;
    player: Principal;
    mode: GameMode;
    time: number;
}
export enum CarType {
    truck = "truck",
    classic = "classic",
    sport = "sport"
}
export enum GameMode {
    timeTrial = "timeTrial",
    singlePlayer = "singlePlayer"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(car: CarType, mode: GameMode): Promise<Array<ScoreEntry>>;
    isCallerAdmin(): Promise<boolean>;
    submitScore(car: CarType, mode: GameMode, time: number): Promise<void>;
}
