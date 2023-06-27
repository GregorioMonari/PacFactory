import { BindingsResults } from "../sepa/BindingsResults";
import { Consumer } from "./Consumer";
/**
 * ### Cached Consumer
 * A Cached Consumer is an extension of a consumer. In addition to emitting an event on results, it contains a builtin Map, which can be used to temporarily store sepa notification, effectively acting as a buffer fo sparql notifications.
 * While the CachedConsumer constructor provides a basic implementation for the modules, it is recommended to implement a custom CachedConsumer which has its own caching logic.
 * Define a cached consumer with custom caching logic:
 * ```
 * class MyCachedConsumer extends CachedConsumer{
 *     constructor(jsap,ignore_first_results){
 *         super(jsap,"MY_QUERY_NAME",{},ignore_first_results)
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
 *
 * Create the CachedConsumer and subscribe:
 * ```
 * let cachedConsumer= new MyCachedConsumer(jsap,false)
 * cachedConsumer.subscribeToSepa();
 * ```
 *
 * Get the internal cache:
 * ```
 * let cache= cachedConsumer.cache;
 * ```
 * Delete all cache contents:
 * ```
 * cachedConsumer.wipe_cache();
 * ```
 */
export declare class CachedConsumer extends Consumer {
    private ignore_first_results;
    private _cache;
    constructor(jsap: any, queryname: string, sub_bindings: any, ignore_first_results: boolean);
    firstResultsIgnored(): boolean;
    onFirstResults(res: BindingsResults): void;
    onRemovedResults(res: BindingsResults): void;
    onAddedResults(res: BindingsResults): void;
    get cache(): Map<string | number, any>;
    wipe_cache(): void;
    /**
     * Generic methods, uses usergraph as basic hashmap key.
     * I suggest override
     * @param {*} binding
     */
    add_bindings_to_cache(res: BindingsResults): void;
    remove_bindings_from_cache(res: BindingsResults): void;
}
