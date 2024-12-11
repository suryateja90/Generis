// src/app/store/app.state.ts

import { AuthState, initialAuthState } from "./auth/auth.state";
import { initialParametersState, ParametersState } from "./parameters/parameters.state";
import { initialProfileState, ProfileState } from "./profile/profile.state";
import { initialReportingState, ReportingState } from "./reporting/reporting.state";
import { initialWebsocketState, WebsocketState } from "./websocket/websocket.state";

export interface AppState {
    auth: AuthState;
    reporting: ReportingState;
    profile: ProfileState;
    parameters: ParametersState;
    websocket: WebsocketState;
}

export const initialAppState: AppState = {
    auth: initialAuthState,
    reporting: initialReportingState,
    profile: initialProfileState,
    parameters: initialParametersState,
    websocket: initialWebsocketState,
};