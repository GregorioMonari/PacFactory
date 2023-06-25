"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindingsResults = void 0;
;
class BindingsResults {
    constructor(bindingsResults) {
        this._head = bindingsResults.head;
        this._results = bindingsResults.results;
    }
    get head() {
        return this._head;
    }
    get results() {
        return this._results;
    }
    getVars() {
        return this.head.vars;
    }
    getBindings() {
        return this.parseBindingsValues(this.results.bindings);
    }
    //!SIZE IS SAFE BECAUSE IT DOES NOT PARSE THE BINDINGS!
    size() {
        return this.results.bindings.length;
    }
    isEmpty() {
        if (this.results.bindings == undefined || this.results.bindings == null) {
            return true;
        }
        if (this.size() == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    parseBindingsValues(resultsArr) {
        var out = [];
        for (const binding of resultsArr) {
            var parsedBinding = {};
            for (const variable of this.getVars()) {
                const value = binding[variable].value;
                parsedBinding[variable] = value;
            }
            out.push(parsedBinding);
        }
        return out;
    }
}
exports.BindingsResults = BindingsResults;
