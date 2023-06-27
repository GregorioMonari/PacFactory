import { CachedConsumer } from "./CachedConsumer";
import { BindingsResults, ParsedBinding } from "../sepa/BindingsResults";
/**
 * ### Synchronous Consumer
 * Similarly to the CachedConsumer, the SynchronousConsumer has an internal cache which gets updated on notification.
 * The difference is that the SynchronousConsumer has a second subscription: the SynchronizationFlag.
 * The SyncFlag can be used to signal the end of a notification stream. Usually, the producer sends two or more messages containing triples, and the SyncConsumer starts caching the messages. Then, the producer sends a Production finished flag. The SyncConsumer provides a custom emitter for this event, the 'newsyncflag' event.
 * Being an extension of a cached consumer, it is necessary to implement a custom caching logic and specify the syncflag bindings.
 *
 * Define a SyncConsumer with custom flag and caching logic:
 * ```
 * class MySynchronousConsumer extends CachedConsumer{
 *     constructor(jsap,ignore_first_results){
 *         let queryName="MY_QUERY_NAME";
 *         let queryBindings={};
 *         let flagQueryName="GET_SYNC_FLAG";
 *         let flagQueryBindings={};
 *         super(jsap,queryName,queryBindings,flagQueryName,flagQueryBindings,ignore_first_results)
 *     }
 *     //@Override
 *     add_bindings_to_cache(res: BindingsResults){
 *         for(let binding of res.getBindings()){
 *             if(!binding.hasOwnProperty("s")){console.log("Skipping binding, no 's' key detected"); continue}
 *             if(this.cache.has(binding.s)){
 *                 console.log("Skipping binding, key already exists");
 *             }else{
 *                 this.cache.set(binding.s,binding)
 *             }
 *             console.log(this.cache)
 *         }
 *     }
 *     //@Override
 *     remove_bindings_from_cache(res: BindingsResults){
 *         for(let binding of res.getBindings()){
 *             if(!binding.hasOwnProperty("s")){console.log("Skipping binding, no 's' key detected"); continue}
 *             if(!this.cache.has(binding.s)){
 *                 console.log("Skipping binding, key does not exist");
 *             }else{
 *                 this.cache.delete(binding.s)
 *             }
 *             console.log(this.cache)
 *         }
 *     }
 * }
 * ```
 * Create a SynchronousConsumer:
 * ```
 * let syncConsumer= new MySynchronousConsumer(jsap,false)
 * ```
 *
 * Listen to the syncflag event, then subscribe to sepa:
 * ```
 * syncConsumer.getEmitter().on("newsyncflag",(not)=>{
 *     let cache=syncConsumer.cache;
 *     console.log(cache)
 * })
 * syncConsumer.subscribeToSepa();
 * ```
 */
export declare class SynchronousConsumer extends CachedConsumer {
    private flagname;
    private flagBindings;
    constructor(jsap_file: any, queryname: string, sub_bindings: ParsedBinding, flag_queryname: string, flag_bindings: ParsedBinding, ignore_first_results: boolean);
    getFlagQueryName(): string;
    getFlagBindings(): ParsedBinding;
    subscribeToSepa(): Promise<void>;
    onSyncFlag(res: BindingsResults): void;
    onFlagFirstResults(res: BindingsResults): void;
    onFlagRemovedResults(res: BindingsResults): void;
    onFlagError(err: any): void;
}
