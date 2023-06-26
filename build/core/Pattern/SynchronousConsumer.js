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
