import * as fs from 'fs';
var log = require("greglogs").default

export class JsapLoader{

    //private log = new GregLogs("./resources/logger_config.json")
    constructor(){}

    private readFileAsJson(fileName: string){
        let file:any= fs.readFileSync(fileName);
        return JSON.parse(file)
    }

    private getDefaultJsap(){
        return this.readFileAsJson("./resources/host.jsap")
    }

    private overrideJsapWithEnv(tempjsap:any){
        if(process.env.HOST_NAME!=undefined){
            var host_name=process.env.HOST_NAME;
            log.trace("LOADING ENV HOST_NAME: "+host_name)
            tempjsap.host=host_name;
        }else{
            //console.log("default hostname")	
        }
        
        if(process.env.HTTP_PORT!=undefined){
            var http_port=process.env.HTTP_PORT;
            log.trace("LOADING ENV HOST_NAME: "+http_port)
            tempjsap.sparql11protocol.port=http_port;	
        }else{
            //console.log("default hostname")	
        }
        
        
        if(process.env.WS_PORT!=undefined){
            var ws_port=process.env.WS_PORT;
            log.trace("LOADING ENV HOST_NAME: "+ws_port)
            tempjsap.sparql11seprotocol.availableProtocols.ws.port=ws_port;
        }else{
            //console.log("default hostname")	
        }
    
        return tempjsap;
    }
    

    public getJsap(pathOverride: string|null){
        if(!pathOverride){
            //no override
            log.warning("No jsap argument found, using default jsap")
            var jsap=this.getDefaultJsap()
            return this.overrideJsapWithEnv(jsap)
        }else{
            const path= pathOverride as string;
            var jsap=this.readFileAsJson(path);
            return this.overrideJsapWithEnv(jsap)
        }
    }

}