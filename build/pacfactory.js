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
var log = require("greglogs").default;
const CachedConsumer_1 = require("./core/Pattern/CachedConsumer");
const ArgumentsParser_1 = require("./utils/ArgumentsParser");
const JsapLoader_1 = require("./utils/JsapLoader");
//const log= new GregLogs("./resources/logger_config.json")
const _argumentsParser = new ArgumentsParser_1.ArgumentsParser();
const _jsapLoader = new JsapLoader_1.JsapLoader();
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("- PACFACTORY -");
        const commandArguments = process.argv.slice(2);
        const config = _argumentsParser.parseArguments(commandArguments);
        log.debug("PacFactory config:", config);
        const jsap = _jsapLoader.getJsap(config.jsapPath);
        log.trace("Jsap:", jsap);
        if (config.appName == null) {
            showHelp();
        }
        else {
            startPacModule(jsap, config);
        }
    });
}
function startPacModule(jsap, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let pac = new CachedConsumer_1.CachedConsumer(jsap, "ALL_USERNAMES", {}, false);
        //let pac= new PacModule(jsap);
        pac.subscribeToSepa();
    });
}
function showHelp() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`HELP`);
    });
}
