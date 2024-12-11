// src/app/store/app.reducer.ts

import { authReducer } from './auth/auth.reducer';
import { parametersReducer } from './parameters/parameters.reducer';
import { profileReducer } from './profile/profile.reducer';
import { reportingReducer } from './reporting/reporting.reducer';
import { websocketReducer } from './websocket/websocket.reducer';

export const appReducer = {
    auth: authReducer,
    reporting: reportingReducer,
    profile: profileReducer,
    parameters: parametersReducer,
    websocket: websocketReducer,
};