import { SESSION_KEYS } from './session.enum';

export interface AuthConfig {
    provider: ProviderUiConfig;
    platform: PlatformUiConfig;
    app: AppUiConfig;
    client: ClientUiConfig;
}

export interface ProviderUiConfig {
    type: string;
    url: string;
    clientId: string;
}

export interface PlatformUiConfig {
    url: string;
}

export interface AppUiConfig {
    url: string;
}

export interface ClientUiConfig {
    appAlias: string;
    tenantAlias: string;
}

export interface SessionModel {
    defaultTimeout: number;
    helpDocumentUrlExpire: number;
    keys: typeof SESSION_KEYS;
    unloadCookieExpire: number;
}
