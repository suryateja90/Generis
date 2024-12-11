import { AuthEffects } from "./auth/auth.effects";
import { ParametersEffects } from "./parameters/parameters.effects";
import { ProfileEffects } from "./profile/profile.effects";
import { ReportingEffects } from "./reporting/reporting.effects";
import { WebsocketEffects } from "./websocket/websocket.effects";

export const appEffects = [
    AuthEffects,
    ReportingEffects,
    ProfileEffects,
    ParametersEffects,
    WebsocketEffects,
];