"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARBindingsResults = void 0;
const BindingsResults_1 = require("./BindingsResults");
class ARBindingsResults {
    constructor(results) {
        this._results = results;
    }
    get spuid() {
        return this.spuid;
    }
    get alias() {
        return this.alias;
    }
    get addedResults() {
        const bindings = this._results.addedResults;
        var res = new BindingsResults_1.BindingsResults(bindings);
        return res;
    }
    get removedResults() {
        const bindings = this._results.removedResults;
        var res = new BindingsResults_1.BindingsResults(bindings);
        return res;
    }
}
exports.ARBindingsResults = ARBindingsResults;
