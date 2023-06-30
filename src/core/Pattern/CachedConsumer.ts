import { BindingsResults } from "../sepa/BindingsResults";
import { Consumer } from "./Consumer";
var log = require("greglogs").default


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
export class CachedConsumer extends Consumer{
    private ignore_first_results:boolean;
    private _cache: Map<string,any>
    constructor(jsap:any,queryname:string,sub_bindings:any,ignore_first_results:boolean){
        super(jsap,queryname,sub_bindings);
        this.ignore_first_results=ignore_first_results
        this._cache=new Map(); //internal cache
    }

    public firstResultsIgnored():boolean{
        return this.ignore_first_results
    }

    //@OVERRIDE
    //MANAGE NOTIFICATIONS
    //!Emit added results after being added to cache
    onFirstResults(res: BindingsResults):void{
        if(!this.ignore_first_results){
            log.trace("First results:",res);
            this.add_bindings_to_cache(res);
            log.debug("Cache size: "+this.cache.size)
            this.getEmitter().emit("firstResults",res)
            
        }
    }
    onRemovedResults(res: BindingsResults):void{
        log.trace("Removed results:",res);
        this.remove_bindings_from_cache(res);
        log.debug("Cache size: "+this.cache.size)
        this.getEmitter().emit("removedResults",res)
        
    }
    onAddedResults(res: BindingsResults):void{
        log.trace("Added results:",res);
        this.add_bindings_to_cache(res);
        log.debug("Cache size: "+this.cache.size)
        this.getEmitter().emit("addedResults",res)
    }

    public get cache(): Map<string|number,any>{
        return this._cache;
    }
    public wipe_cache(): void{
        this.cache.clear()
    }

    /**
     * Generic methods, uses usergraph as basic hashmap key. 
     * I suggest override
     * @param {*} binding 
     */
    add_bindings_to_cache(res: BindingsResults){
        for(let binding of res.getBindings()){
            if(!binding.hasOwnProperty("s")){log.trace("Skipping binding, no usergraph key detected"); continue}
            if(this.cache.has(binding.s)){
                log.trace("Skipping binding, key already exists");
            }else{
                this.cache.set(binding.s,binding)
            }
            log.trace(this.cache)
        }
    }
    remove_bindings_from_cache(res: BindingsResults){
        for(let binding of res.getBindings()){
            if(!binding.hasOwnProperty("s")){log.trace("Skipping binding, no usergraph key detected"); continue}
            if(!this.cache.has(binding.s)){
                log.trace("Skipping binding, key does not exist");
            }else{
                this.cache.delete(binding.s)
            }
            log.trace(this.cache)
        }
    }

}


//module.exports=CachedConsumer