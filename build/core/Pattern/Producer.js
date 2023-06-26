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
exports.Producer = void 0;
var log = require("greglogs").default;
const PacModule_1 = require("../PacModule");
class Producer extends PacModule_1.PacModule {
    constructor(jsap, updatename) {
        super(jsap);
        this.updatename = updatename;
    }
    getUpdateName() {
        return this.updatename;
    }
    updateSepa(bindings) {
        return __awaiter(this, void 0, void 0, function* () {
            var failed = false;
            try {
                var forcedBindings = this.updates[this.updatename].forcedBindings;
                if (Object.keys(forcedBindings).length == Object.keys(bindings).length) {
                    Object.keys(forcedBindings).forEach(fk => {
                        if (!bindings.hasOwnProperty(fk)) {
                            failed = true;
                        }
                    });
                }
                else {
                    failed = true;
                }
            }
            catch (e) {
                console.log(e);
            }
            if (failed) {
                log.error("Bindings mismatch in update: " + this.updatename + ", showing logs:");
                console.log("bindings: " + Object.keys(bindings).join(" - "));
                console.log("forcedBindings: " + Object.keys(forcedBindings).join(" - "));
                throw new Error(`Bindings mismatch`);
            }
            else {
                log.trace("Update bindings ok");
            }
            var res = yield this[this.updatename](bindings);
            return res;
        });
    }
    onError(err) {
        throw new Error(`Error from ${this.getUpdateName} consumer: ${err}`);
    }
}
exports.Producer = Producer;
//module.exports = Producer;
