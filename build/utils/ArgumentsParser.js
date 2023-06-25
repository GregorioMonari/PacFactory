"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentsParser = void 0;
const GregLogs_1 = require("./GregLogs");
class ArgumentsParser {
    constructor() {
        this.log = new GregLogs_1.GregLogs();
    }
    parseArguments(args) {
        if (args.length == 0) {
            this.log.warning("No arguments received, returning empy object");
            let config = {
                "appName": null,
                "jsapPath": null,
                "logLevel": null
            };
            return config;
        }
        this.log.debug("Arguments:", args);
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
