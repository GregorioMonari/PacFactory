import { BindingsResults } from "../sepa/BindingsResults";
import { Consumer } from "./Consumer";
var log = require("greglogs").default

export class CachedConsumer extends Consumer{
    private ignore_first_results:boolean;
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
            this.getEmitter().emit("firstResults",res)
            log.debug("Cache size: "+this.cache.size)
        }
    }
    onRemovedResults(res: BindingsResults):void{
        log.trace("Removed results:",res);
        this.remove_bindings_from_cache(res);
        this.getEmitter().emit("removedResults",res)
        log.debug("Cache size: "+this.cache.size)
    }
    onAddedResults(res: BindingsResults):void{
        log.trace("Added results:",res);
        this.add_bindings_to_cache(res);
        this.getEmitter().emit("addedResults",res)
        log.debug("Cache size: "+this.cache.size)
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