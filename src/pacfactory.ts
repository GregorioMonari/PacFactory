var log = require("greglogs").default
import { PacModule } from "./core/PacModule"
import { Consumer } from "./core/Pattern/Consumer"
import { CachedConsumer } from "./core/Pattern/CachedConsumer"
import { ArgumentsParser, PacFactoryConfig } from "./utils/ArgumentsParser"
import { JsapLoader } from "./utils/JsapLoader"

//const log= new GregLogs("./resources/logger_config.json")
const _argumentsParser= new ArgumentsParser();
const _jsapLoader= new JsapLoader();
main()

async function main(){

    console.log("- PACFACTORY -")

    const commandArguments: string[] = process.argv.slice(2);
    const config: PacFactoryConfig = _argumentsParser.parseArguments(commandArguments)
    log.debug("PacFactory config:",config)
    const jsap = _jsapLoader.getJsap(config.jsapPath);
    log.trace("Jsap:",jsap)

    if(config.appName==null){
        showHelp()
    }else{
        startPacModule(jsap,config)
    }
}



async function startPacModule(jsap: object,config: PacFactoryConfig): Promise<void>{
    let pac= new CachedConsumer(jsap,"ALL_USERNAMES",{},false);
    //let pac= new PacModule(jsap);
    pac.subscribeToSepa()
}



async function showHelp(){
    console.log(`HELP`)
}

