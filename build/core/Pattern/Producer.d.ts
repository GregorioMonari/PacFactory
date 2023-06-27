import { PacModule } from "../PacModule";
export interface UpdateBindings {
    [key: string]: string | number | string[] | number[];
}
export declare class Producer extends PacModule {
    private updatename;
    constructor(jsap: any, updatename: string);
    getUpdateName(): string;
    updateSepa(bindings: UpdateBindings): Promise<any>;
    onError(err: any): void;
}
