import { PacModule } from "../PacModule";
import { BindingsResults, ParsedBinding } from "../sepa/BindingsResults";
/**
 * ### Consumer
 * Create a consumer:
 * ```
 * const queryName="ALL_USERNAMES";
 * const bindings={};
 * let consumer= new Consumer(jsap,queryName,bindings)
 * ```
 *
 * A Consumer contains an event emitter that fires on: first,added and received results. The event emitter can be listened to react to a notification:
 * ```
 * consumer.getEmitter().on("firstResults",(not)=>{
 *     console.log(not)
 * })
 * consumer.getEmitter().on("addedResults",(not)=>{
 *     console.log(not)
 * })
 * consumer.getEmitter().on("removedResults",(not)=>{
 *     console.log(not)
 * })
 * ```

 * Alternatively, a new Class that extends the Consumer can be created to implement a custom consumer:
 * ```
 * class MyConsumer{
 *     constructor(jsap){
 *         super(jsap,"MY_QUERY_NAME")
 *     }
 *
 *     //@Override
 *     onFirstResults(not){
 *         console.log(not)
 *     }
 *     //@Override
 *     onAddedResults(not){
 *         console.log(not)
 *     }
 *     //@Override
 *     onRemovedResults(not){
 *         console.log(not)
 *     }
 * }
 * ```
 *
 *
 * After declaring the event listeners, the consumer needs to subscribe to sepa to begin receiving notifications:
 * ```
 * consumer.subscribeToSepa()
 * ```
 */
export declare class Consumer extends PacModule {
    private queryname;
    private sub_bindings;
    private notificationEmitter;
    constructor(jsap: any, queryname: string, sub_bindings: ParsedBinding);
    getEmitter(): any;
    getConsumerQueryName(): string;
    getConsumerBindings(): ParsedBinding;
    test(): Promise<boolean>;
    subscribeToSepa(): void;
    querySepa(): Promise<any>;
    querySepaWithBindings(override_bindings: ParsedBinding): Promise<any>;
    extractResultsBindings(queryRes: any): any;
    onFirstResults(res: BindingsResults): void;
    onAddedResults(res: BindingsResults): void;
    onRemovedResults(res: BindingsResults): void;
    onError(err: any): void;
}
