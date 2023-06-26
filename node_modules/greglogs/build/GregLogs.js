"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
class GregLogs {
    constructor(config_path) {
        var path;
        if (config_path == null || config_path == undefined) {
            path = "./resources/logger_config.json";
        }
        else {
            path = config_path;
        }
        let config;
        try {
            config = this.getConfigFromFile(path);
        }
        catch (e) {
            console.error("Error loading config file, using default logger configuration");
            config = {
                "logLevel": 1,
                "separator": " | ",
                "divLogger": {
                    "enabled": false,
                    "logLevel": 0,
                    "elementId": "console"
                }
            };
        }
        this._logLevel = config.logLevel;
        this._separator = config.separator;
        this._divLoggerEnabled = config.divLogger.enabled;
        this._divLoggerlogLevel = config.divLogger.logLevel;
        this._divLoggerElementId = config.divLogger.elementId;
        this._colorMap = this.generateColorsMap();
    }
    static getInstance(filePath) {
        if (!GregLogs.instance) {
            GregLogs.instance = new GregLogs(filePath);
        }
        return GregLogs.instance;
    }
    setLogLevel(n) {
        this._logLevel = n;
    }
    setConfigFromFile(filename) {
        let config = this.getConfigFromFile(filename);
        this._logLevel = config.logLevel;
        this._separator = config.separator;
        this._divLoggerEnabled = config.divLogger.enabled;
        this._divLoggerlogLevel = config.divLogger.logLevel;
        this._divLoggerElementId = config.divLogger.elementId;
    }
    getConfigFromFile(fileName) {
        let file = fs.readFileSync(fileName);
        return JSON.parse(file);
    }
    generateColorsMap() {
        return {
            "nocolor": "\x1b[0m",
            "Bright": "\x1b[1m",
            "Dim": "\x1b[2m",
            "Underscore": "\x1b[4m",
            "Blink": "\x1b[5m",
            "Reverse": "\x1b[7m",
            "Hidden": "\x1b[8m",
            "black": "\x1b[30m",
            "red": "\x1b[31m",
            "green": "\x1b[32m",
            "yellow": "\x1b[33m",
            "blue": "\x1b[34m",
            "magenta": "\x1b[35m",
            "cyan": "\x1b[36m",
            "white": "\x1b[37m",
            "gray": "\x1b[90m",
            "BgBlack": "\x1b[40m",
            "BgRed": "\x1b[41m",
            "BgGreen": "\x1b[42m",
            "BgYellow": "\x1b[43m",
            "BgBlue": "\x1b[44m",
            "BgMagenta": "\x1b[45m",
            "BgCyan": "\x1b[46m",
            "BgWhite": "\x1b[47m",
            "BgGray": "\x1b[100m",
        };
    }
    get logLevel() {
        return this._logLevel;
    }
    get separator() {
        return this._separator;
    }
    isDivLoggerEnabled() {
        return this._divLoggerEnabled;
    }
    get divLoggerLogLevel() {
        return this._divLoggerlogLevel;
    }
    get divLoggerElementId() {
        return this._divLoggerElementId;
    }
    get colorMap() {
        return this._colorMap;
    }
    trace(...text) {
        if (this.logLevel < 1) {
            console.log(get_current_timestamp() + this.separator + "[trace]", ...text);
        }
    }
    debug(...text) {
        if (this.logLevel < 2) {
            console.log(get_current_timestamp() + this.separator + "[debug]", ...text);
        }
    }
    info(...text) {
        //var string=this.info.caller.name
        if (this.logLevel < 3) {
            console.log(get_current_timestamp() + this.separator + "[info ]", ...text);
        }
    }
    warning(...text) {
        if (this.logLevel < 4) {
            console.log(get_current_timestamp() + this.separator + "[warning]", ...text);
        }
    }
    error(...text) {
        console.log(get_current_timestamp() + this.separator + "[" + this.wrapColor("red", "error") + "]" +
            this.colorMap["red"], text, this.colorMap["nocolor"]);
    }
    //Utils
    /**
     * # Wraps text in color
     * example: log.wrapColoredSection("red","Hello!")
     * @param color
     * @param text
     * @returns
     */
    wrapColoredSection(color, text) {
        if (color == undefined || color == null) {
            return text;
        }
        var left = "--------------------------------------------------------------<";
        var right = ">--------------------------------------------------------------";
        return left + this.colorMap["Bright"] + this.colorMap[color] + text + this.colorMap["nocolor"] + right;
    }
    wrapColor(color, text) {
        if (color == undefined || color == null) {
            return text;
        }
        return this.colorMap[color] + text + this.colorMap["nocolor"];
    }
    trace_table(text) {
        if (this.logLevel < 1) {
            console.table(text);
        }
    }
    debug_table(text) {
        if (this.logLevel < 2) {
            console.table(text);
        }
    }
    info_table(text) {
        if (this.logLevel < 3) {
            console.table(text);
        }
    }
}
//----------------------
//NAME: GET CURRENT TIME
//DESCRIPTION: returns the current formatted time
function get_current_timestamp() {
    const date = new Date();
    var string_timestamp = date.toISOString();
    var timestamp = string_timestamp.split("T");
    //console.log(stringa)
    return timestamp[0] + " " + timestamp[1].slice(0, timestamp[1].length - 1);
} //get_current_timestamp()
//!CREATE STATIC LOGGER
const log = GregLogs.getInstance("./resources/logger_config.json");
exports.default = log;
