var log = require("greglogs").default

export interface PacFactoryConfig {
    "appName":string | null;
    "jsapPath":string | null;
    "logLevel":number | null;
}

export class ArgumentsParser {
    //private log = new GregLogs("./resources/logger_config.json")
    constructor(){}

    public parseArguments(args: string[]): PacFactoryConfig{
        if(args.length==0){
            log.warning("No arguments received, returning empy object")
            let config: PacFactoryConfig = {
                "appName": null,
                "jsapPath": null,
                "logLevel": null
            };           
            return config
        }

        
        log.debug("Arguments:",args)
        const app=args[0]
        let config: PacFactoryConfig = {
            "appName": app,
            "jsapPath": null,
            "logLevel": null
        };

        const appArgs=args.splice(1);
        for(var i=0; i<appArgs.length; i++){
            switch (appArgs[i]) {
                case "-jsap":
                    config.jsapPath= appArgs[i+1]
                    i++
                    break;

                case "-loglevel":
                    config.logLevel= parseInt(appArgs[i+1])
                    i++
                    break;
            
                default:
                    break;
            }
        }

        return config
    }



}