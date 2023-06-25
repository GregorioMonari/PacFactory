"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedConsumer = void 0;
const Consumer_1 = require("./Consumer");
class CachedConsumer extends Consumer_1.Consumer {
    constructor(jsap, queryname, sub_bindings, ignore_first_results) {
        super(jsap, queryname, sub_bindings);
        this.ignore_first_results = ignore_first_results;
        this._cache = new Map(); //internal cache
    }
    firstResultsIgnored() {
        return this.ignore_first_results;
    }
    //@OVERRIDE
    //MANAGE NOTIFICATIONS
    //!Emit added results after being added to cache
    onFirstResults(res) {
        if (!this.ignore_first_results) {
            this.log.trace("First results:", res);
            this.add_bindings_to_cache(res);
            this.getEmitter().emit("firstResults", res);
            this.log.debug("Cache size: " + this.cache.size);
        }
    }
    onRemovedResults(res) {
        this.log.trace("Removed results:", res);
        this.remove_bindings_from_cache(res);
        this.getEmitter().emit("removedResults", res);
        this.log.debug("Cache size: " + this.cache.size);
    }
    onAddedResults(res) {
        this.log.trace("Added results:", res);
        this.add_bindings_to_cache(res);
        this.getEmitter().emit("addedResults", res);
        this.log.debug("Cache size: " + this.cache.size);
    }
    get cache() {
        return this._cache;
    }
    wipe_cache() {
        this.cache.clear();
    }
    /**
     * Generic methods, uses usergraph as basic hashmap key.
     * I suggest override
     * @param {*} binding
     */
    add_bindings_to_cache(res) {
        for (let binding of res.getBindings()) {
            if (!binding.hasOwnProperty("s")) {
                this.log.trace("Skipping binding, no usergraph key detected");
                continue;
            }
            if (this.cache.has(binding.s)) {
                this.log.trace("Skipping binding, key already exists");
            }
            else {
                this.cache.set(binding.s, binding);
            }
            this.log.trace(this.cache);
        }
    }
    remove_bindings_from_cache(res) {
        for (let binding of res.getBindings()) {
            if (!binding.hasOwnProperty("s")) {
                this.log.trace("Skipping binding, no usergraph key detected");
                continue;
            }
            if (!this.cache.has(binding.s)) {
                this.log.trace("Skipping binding, key does not exist");
            }
            else {
                this.cache.delete(binding.s);
            }
            this.log.trace(this.cache);
        }
    }
}
exports.CachedConsumer = CachedConsumer;