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
exports.PacModule = void 0;
//import {JsapApi, SEPA} from '@arces-wot/sepa-js'//jsap api
const JsapApi = require('@arces-wot/sepa-js').Jsap;
var log = require("greglogs").default;
const ARBindingsResults_1 = require("./sepa/ARBindingsResults");
/**
 * # PAC MODULE
 * Generic class which implements helper functions for jsapApi
 * ### Included modules
 * - this.api (SEPA api)
 * - this.bench (QueryBench)
 * - this.extendedConfig
 */
class PacModule extends JsapApi {
    //public log= new GregLogs("./resources/logger_config.json");
    constructor(jsap) {
        super(jsap);
        this._ACTIVE_SUBSCRIPTIONS_ARR = new Map();
    }
    stop() {
        for (var k of this.activeSubscriptions.keys()) {
            var currSub = this.activeSubscriptions.get(k);
            currSub.instance.unsubscribe();
            log.info("Unsubscribed from '" + currSub.name + "', alias: " + currSub.instance._alias + ", spuid: " + currSub.instance._stream.spuid);
            this.activeSubscriptions.delete(k);
        }
    }
    get hostName() {
        return this.host;
    }
    get updateProtocol() {
        return this.sparql11protocol.protocol;
    }
    get updatePort() {
        return parseInt(this.sparql11protocol.port);
    }
    get subscribeProtocol() {
        return this.sparql11seprotocol.protocol;
    }
    get subscribePort() {
        const protocol = this.subscribeProtocol;
        return this.sparql11seprotocol.availableProtocols[protocol].port;
    }
    get extendedConfig() {
        return this.extended;
    }
    get activeSubscriptions() {
        return this._ACTIVE_SUBSCRIPTIONS_ARR;
    }
    /**
     * Initializes a subscription.
     */
    startSubscription(queryname, data, added, first, removed, error) {
        return __awaiter(this, void 0, void 0, function* () {
            var firstResults = true;
            var sub = this[queryname](data);
            log.info(`Subscribed to '${queryname}', alias: ${sub._alias}`);
            sub.on("notification", (notification) => __awaiter(this, void 0, void 0, function* () {
                log.debug("** Notification from \'" + queryname + "\' subscription received, alias: " + sub._alias + ", spuid: " + sub._stream.spuid);
                log.trace(notification);
                let arBindings = new ARBindingsResults_1.ARBindingsResults(notification);
                if (!firstResults) {
                    if (!arBindings.removedResults.isEmpty())
                        yield this[removed](arBindings.removedResults);
                    if (!arBindings.addedResults.isEmpty())
                        yield this[added](arBindings.addedResults);
                }
                else {
                    firstResults = false;
                    yield this[first](arBindings.addedResults);
                }
            }));
            sub.on("error", (err) => {
                this[error](err);
            });
            this.activeSubscriptions.set(sub._alias, {
                "name": queryname,
                "instance": sub
            });
        });
    }
} //---------------------------------------------------------END OF PAC FACTORY----------------------------------------------------
exports.PacModule = PacModule;
//module.exports=PacModule
