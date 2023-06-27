export interface PacFactoryConfig {
    "appName": string | null;
    "jsapPath": string | null;
    "logLevel": number | null;
}
export declare class ArgumentsParser {
    constructor();
    parseArguments(args: string[]): PacFactoryConfig;
}
