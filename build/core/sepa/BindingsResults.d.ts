export interface ParsedBinding {
    [key: string]: string | number;
}
export interface Binding {
    [key: string]: {
        type: string;
        value: string;
    };
}
export interface Head {
    vars: string[];
}
export interface Results {
    bindings: Binding[];
}
/**
 * Interface for the json added or removed results received from SEPA
 */
export interface SepaBindingsResults {
    head: Head;
    results: Results;
}
/**
 * ## BindingsResults
 * Enriches added or removed results received from Sepa Engine with helper methods.
 * ### Usage
 * Initialize by calling the constructor with SepaBindingsResults as parameter:
 * ```
 * const bindingsResults = new BindingsResults(sepaBindingsResults)
 * ```
 * Get results vars:
 * ```
 * const vars:string[]= bindingsResults.getVars()
 * ```
 * Get results as parsed bindings:
 * ```
 * const bindings:ParsedBinding[]= bindingsResults.getBindings()
 * ```
 * Get bindings size (before parsing, it is more optimized than calling bindingsResults.getBindings().length)
 * ```
 * const size:number= bindingsResults.size()
 * ```
 * Is empty:
 * ```
 * const test:boolean= bindingsResults.isEmpty()
 * ```
 */
export declare class BindingsResults implements SepaBindingsResults {
    private _head;
    private _results;
    constructor(bindingsResults: SepaBindingsResults);
    get head(): Head;
    get results(): Results;
    getVars(): string[];
    getBindings(): ParsedBinding[];
    size(): number;
    isEmpty(): boolean;
    private parseBindingsValues;
}
