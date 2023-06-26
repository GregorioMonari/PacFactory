import * as fs from 'fs';

interface GregLogsConfig {
  logLevel: number;
  separator:string;
  divLogger:{
      enabled:boolean;
      logLevel:number;
      elementId:string;
  }
}

class GregLogs{
    private static instance: GregLogs;
    private _logLevel: number;
    private _separator: string;
    private _divLoggerEnabled:boolean;
    private _divLoggerlogLevel:number;
    private _divLoggerElementId:string;
    private _colorMap:object;

    public constructor(config_path:string|null|undefined) {
      var path:string;
      if(config_path == null || config_path== undefined ){
        path="./resources/logger_config.json";
      }else{
        path=config_path;
      }

      let config: GregLogsConfig;
      try{
        config=this.getConfigFromFile(path);
      }catch(e){
        console.error("Error loading config file, using default logger configuration")
        config={
          "logLevel":1,
          "separator":" | ",
          "divLogger":{
              "enabled":false,
              "logLevel":0,
              "elementId":"console"
          }
        }
      }
      this._logLevel = config.logLevel
      this._separator= config.separator
      this._divLoggerEnabled=config.divLogger.enabled
      this._divLoggerlogLevel=config.divLogger.logLevel
      this._divLoggerElementId=config.divLogger.elementId
      this._colorMap=this.generateColorsMap();
    }

    public static getInstance(filePath: string): GregLogs{
      if(!GregLogs.instance){
        GregLogs.instance = new GregLogs(filePath);
      }
      return GregLogs.instance
    }

    public setLogLevel(n:number):void{
      this._logLevel=n
    }

    public setConfigFromFile(filename:string):void{
      let config: GregLogsConfig=this.getConfigFromFile(filename);
      this._logLevel = config.logLevel
      this._separator= config.separator
      this._divLoggerEnabled=config.divLogger.enabled
      this._divLoggerlogLevel=config.divLogger.logLevel
      this._divLoggerElementId=config.divLogger.elementId
    }

    private getConfigFromFile(fileName:string): GregLogsConfig{
      let file:any= fs.readFileSync(fileName);
      return JSON.parse(file)
    }
    private generateColorsMap(): any{
      return {
        "nocolor":"\x1b[0m",
        "Bright":"\x1b[1m",
        "Dim":"\x1b[2m",
        "Underscore":"\x1b[4m",
        "Blink":"\x1b[5m",
        "Reverse":"\x1b[7m",
        "Hidden":"\x1b[8m",

        "black":"\x1b[30m",
        "red":"\x1b[31m",
        "green":"\x1b[32m",
        "yellow":"\x1b[33m",
        "blue":"\x1b[34m",
        "magenta":"\x1b[35m",
        "cyan":"\x1b[36m",
        "white":"\x1b[37m",
        "gray":"\x1b[90m",
        
        "BgBlack":"\x1b[40m",
        "BgRed":"\x1b[41m",
        "BgGreen":"\x1b[42m",
        "BgYellow":"\x1b[43m",
        "BgBlue":"\x1b[44m",
        "BgMagenta":"\x1b[45m",
        "BgCyan":"\x1b[46m",
        "BgWhite":"\x1b[47m",
        "BgGray":"\x1b[100m",
      }
    }
    public get logLevel(): number{
      return this._logLevel
    }
    public get separator(): string{
      return this._separator
    }
    public isDivLoggerEnabled(): boolean{
      return this._divLoggerEnabled
    }
    public get divLoggerLogLevel(): number{
      return this._divLoggerlogLevel
    }
    public get divLoggerElementId(): string{
      return this._divLoggerElementId
    }
    public get colorMap(): any{
      return this._colorMap;
    }




  
    public trace(...text: (string|number|object)[]): void{
      if(this.logLevel<1){
        console.log(get_current_timestamp()+this.separator+"[trace]",...text);
      }      
    }
    public debug(...text: (string|number|object)[]): void{
      if(this.logLevel<2){
        console.log(get_current_timestamp()+this.separator+"[debug]",...text);
      }
    }
    public info(...text: (string|number|object)[]): void{
      //var string=this.info.caller.name
      if(this.logLevel<3){
        console.log(get_current_timestamp()+this.separator+"[info ]",...text);
      }
    }
    public warning(...text: (string|number|object)[]): void{
      if(this.logLevel<4){
        console.log(get_current_timestamp()+this.separator+"[warning]",...text);
      }
    }
    error(...text: (string|number|object)[]): void{
      console.log(get_current_timestamp()+this.separator+"["+this.wrapColor("red","error")+"]"+
      this.colorMap["red"],text,this.colorMap["nocolor"]);
    }


    //Utils
    /**
     * # Wraps text in color
     * example: log.wrapColoredSection("red","Hello!")
     * @param color 
     * @param text 
     * @returns 
     */
    wrapColoredSection(color:string,text:string){
      if(color==undefined||color==null){return text}
      var left ="--------------------------------------------------------------<"
      var right=">--------------------------------------------------------------"
      return left+this.colorMap["Bright"]+this.colorMap[color]+text+this.colorMap["nocolor"]+right
    }

    wrapColor(color: string,text: string){
      if(color==undefined||color==null){return text}
      return this.colorMap[color]+text+this.colorMap["nocolor"]
    }


    trace_table(text: object){
      if(this.logLevel<1){
        console.table(text);
      }      
    }    
    debug_table(text: object){
      if(this.logLevel<2){
        console.table(text);
      }      
    }    
    info_table(text: object){
      if(this.logLevel<3){
        console.table(text);
      }      
    }




  }
  
  
  
  //----------------------
  //NAME: GET CURRENT TIME
  //DESCRIPTION: returns the current formatted time
  function get_current_timestamp(){
      const date=new Date();
      var string_timestamp=date.toISOString()
      var timestamp=string_timestamp.split("T");
      //console.log(stringa)
      return timestamp[0]+" "+timestamp[1].slice(0,timestamp[1].length-1)
  }//get_current_timestamp()





//!CREATE STATIC LOGGER
const log = GregLogs.getInstance("./resources/logger_config.json")
export default log;