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
exports.JsapLoader = void 0;
const fs = __importStar(require("fs"));
var log = require("greglogs").default;
class JsapLoader {
    //private log = new GregLogs("./resources/logger_config.json")
    constructor() { }
    readFileAsJson(fileName) {
        let file = fs.readFileSync(fileName);
        return JSON.parse(file);
    }
    getDefaultJsap() {
        return this.readFileAsJson("./resources/host.jsap");
    }
    overrideJsapWithEnv(tempjsap) {
        if (process.env.HOST_NAME != undefined) {
            var host_name = process.env.HOST_NAME;
            log.trace("LOADING ENV HOST_NAME: " + host_name);
            tempjsap.host = host_name;
        }
        else {
            //console.log("default hostname")	
        }
        if (process.env.HTTP_PORT != undefined) {
            var http_port = process.env.HTTP_PORT;
            log.trace("LOADING ENV HOST_NAME: " + http_port);
            tempjsap.sparql11protocol.port = http_port;
        }
        else {
            //console.log("default hostname")	
        }
        if (process.env.WS_PORT != undefined) {
            var ws_port = process.env.WS_PORT;
            log.trace("LOADING ENV HOST_NAME: " + ws_port);
            tempjsap.sparql11seprotocol.availableProtocols.ws.port = ws_port;
        }
        else {
            //console.log("default hostname")	
        }
        return tempjsap;
    }
    getJsap(pathOverride) {
        if (!pathOverride) {
            //no override
            log.warning("No jsap argument found, using default jsap");
            var jsap = this.getDefaultJsap();
            return this.overrideJsapWithEnv(jsap);
        }
        else {
            const path = pathOverride;
            var jsap = this.readFileAsJson(path);
            return this.overrideJsapWithEnv(jsap);
        }
    }
}
exports.JsapLoader = JsapLoader;
