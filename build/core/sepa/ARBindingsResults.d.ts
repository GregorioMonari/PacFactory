import { BindingsResults, SepaBindingsResults } from "./BindingsResults";
export interface SepaResponse {
    spuid: string;
    alias: string;
    sequence: number;
    addedResults: SepaBindingsResults;
    removedResults: SepaBindingsResults;
}
export declare class ARBindingsResults {
    private _results;
    constructor(results: SepaResponse);
    get spuid(): string;
    get alias(): string;
    get addedResults(): BindingsResults;
    get removedResults(): BindingsResults;
}
