"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentsParser = void 0;
var log = require("greglogs").default;
class ArgumentsParser {
    //private log = new GregLogs("./resources/logger_config.json")
    constructor() { }
    parseArguments(args) {
        if (args.length == 0) {
            log.warning("No arguments received, returning empy object");
            let config = {
                "appName": null,
                "jsapPath": null,
                "logLevel": null
            };
            return config;
        }
        log.debug("Arguments:", args);
        const app = args[0];
        let config = {
            "appName": app,
            "jsapPath": null,
            "logLevel": null
        };
        const appArgs = args.splice(1);
        for (var i = 0; i < appArgs.length; i++) {
            switch (appArgs[i]) {
                case "-jsap":
                    config.jsapPath = appArgs[i + 1];
                    i++;
                    break;
                case "-loglevel":
                    config.logLevel = parseInt(appArgs[i + 1]);
                    i++;
                    break;
                default:
                    break;
            }
        }
        return config;
    }
}
exports.ArgumentsParser = ArgumentsParser;
