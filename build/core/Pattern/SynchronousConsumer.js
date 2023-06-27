"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynchronousConsumer = void 0;
const CachedConsumer_1 = require("./CachedConsumer");
var log = require("greglogs").default;
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
class SynchronousConsumer extends CachedConsumer_1.CachedConsumer {
    constructor(jsap_file, queryname, sub_bindings, flag_queryname, flag_bindings, ignore_first_results) {
        super(jsap_file, queryname, sub_bindings, ignore_first_results);
        this.flagname = flag_queryname; //trigger flag
        this.flagBindings = flag_bindings;
    }
    getFlagQueryName() {
        return this.flagname;
    }
    getFlagBindings() {
        return this.flagBindings;
    }
    //@OVERRIDE
    subscribeToSepa() {
        return __awaiter(this, void 0, void 0, function* () {
            this.subscribeAndNotify(this.getConsumerQueryName(), this.getConsumerBindings(), "onAddedResults", "onFirstResults", "onRemovedResults", "onError");
            this.subscribeAndNotify(this.geFlagQueryName(), this.getFlagBindings(), "onSyncFlag", "onFlagFirstResults", "onFlagRemovedResults", "onFlagError");
        });
    }
    onSyncFlag(res) {
        for (const flagBinding of res.getBindings()) {
            log.debug("Added results:", flagBinding);
            this.getEmitter().emit("newsyncflag", flagBinding);
            this.RESET_SYNCHRONIZATION_FLAG({ flag: flagBinding.flag });
        }
    }
    onFlagFirstResults(res) {
        if (this.firstResultsIgnored()) {
            this.onSyncFlag(res);
        }
    }
    onFlagRemovedResults(res) {
        log.debug("Removed results:", res.getBindings());
        this.getEmitter().emit("flagremovedResults", res);
    }
    onFlagError(err) {
        throw new Error(`Error from ${this.getFlagQueryName} consumer: ${err}`);
    }
}
exports.SynchronousConsumer = SynchronousConsumer;
//module.exports = SynchronousConsumer;
