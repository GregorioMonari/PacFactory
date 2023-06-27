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
exports.Consumer = void 0;
const PacModule_1 = require("../PacModule");
const EventEmitter = require("events").EventEmitter;
var log = require("greglogs").default;
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
class Consumer extends PacModule_1.PacModule {
    constructor(jsap, queryname, sub_bindings) {
        super(jsap);
        this.queryname = queryname;
        this.sub_bindings = sub_bindings;
        this.notificationEmitter = new EventEmitter();
    }
    getEmitter() {
        return this.notificationEmitter;
    }
    getConsumerQueryName() {
        return this.queryname;
    }
    getConsumerBindings() {
        return this.sub_bindings;
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            this.subscribeToSepa();
            return true;
        });
    }
    subscribeToSepa() {
        this.startSubscription(this.queryname, this.sub_bindings, "onAddedResults", "onFirstResults", "onRemovedResults", "onError");
    }
    //TODO:WARNING, WORKS ONLY WITH MODIFIED JSAP CLASS (configs need to accept sparql11protocol)
    //@OVERRIDE
    querySepa() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryName = this.getConsumerQueryName();
            const bindings = this.getConsumerBindings();
            var res = yield this[queryName].query(bindings);
            res = this.extractResultsBindings(res);
            return res;
        });
    }
    querySepaWithBindings(override_bindings) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryName = this.getConsumerQueryName();
            const bindings = override_bindings;
            var res = yield this[queryName].query(bindings);
            res = this.extractResultsBindings(res);
            return res;
        });
    }
    extractResultsBindings(queryRes) {
        var rawBindings = queryRes.results.bindings;
        var bindings = [];
        var rawCell = {};
        var cell = {};
        Object.keys(rawBindings).forEach(k => {
            rawCell = rawBindings[k]; //extract single rawcell
            Object.keys(rawCell).forEach(field => {
                cell[field] = rawCell[field].value;
            });
            bindings[k] = cell; //assign cell to bindings array
            cell = {};
            rawCell = {};
        });
        return bindings;
    }
    onFirstResults(res) {
        log.debug("First results:", res.getBindings());
        this.getEmitter().emit("firstResults", res);
    }
    onAddedResults(res) {
        log.debug("Added results:", res.getBindings());
        this.getEmitter().emit("addedResults", res);
    }
    onRemovedResults(res) {
        log.debug("Removed results:", res.getBindings());
        this.getEmitter().emit("removedResults", res);
    }
    onError(err) {
        throw new Error(`Error from ${this.queryname} consumer: ${err}`);
    }
}
exports.Consumer = Consumer;
//module.exports=Consumer;
