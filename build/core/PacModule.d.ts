declare const JsapApi: any;
/**
 * ## PAC MODULE
 * Generic class which implements helper functions for jsapApi.
 * The constructor requires a Jsap file in parsed Json format.
 * ### Included modules
 * - this.api (SEPA api)
 * - this.bench (QueryBench)
 * - this.extendedConfig
 */
export declare class PacModule extends JsapApi {
    private _ACTIVE_SUBSCRIPTIONS_ARR;
    constructor(jsap: object);
    /**
     * Unsubscribes the module from any active subscription, effectively stopping it.
     */
    stop(): void;
    get hostName(): string;
    get updateProtocol(): string;
    get updatePort(): number;
    get subscribeProtocol(): string;
    get subscribePort(): number;
    get extendedConfig(): object;
    get activeSubscriptions(): Map<string, any>;
    /**
     * ## Subscribe to Sepa
     * **Subscribes** the module to an active **Sepa Engine**. Stop the module by calling the 'stop()' method.
     * The Sepa connection parameters must be provided by the jsap file in the module constructor
     * In addition, the callbacks stringified names of the callbacks functions for added,
     * removed and first results must be provided
     */
    startSubscription(queryname: string, data: object, added: any, first: any, removed: any, error: any): Promise<void>;
}
export {};
