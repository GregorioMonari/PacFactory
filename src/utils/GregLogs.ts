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

export class GregLogs{

    private _logLevel: number;
    private _separator: string;
    private _divLoggerEnabled:boolean;
    private _divLoggerlogLevel:number;
    private _divLoggerElementId:string;
    private _colorMap:object;

    public constructor() {
      let config: GregLogsConfig= this.getConfigFromFile("./resources/logger_config.json");
      this._logLevel = config.logLevel
      this._separator= config.separator
      this._divLoggerEnabled=config.divLogger.enabled
      this._divLoggerlogLevel=config.divLogger.logLevel
      this._divLoggerElementId=config.divLogger.elementId
      this._colorMap=this.generateColorsMap();
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
        console.log(get_current_timestamp()+this.separator+"[trace] ",...text);
      }      
    }
    public debug(...text: (string|number|object)[]): void{
      if(this.logLevel<2){
        console.log(get_current_timestamp()+this.separator+"[debug] ",...text);
      }
    }
    public info(...text: (string|number|object)[]): void{
      //var string=this.info.caller.name
      if(this.logLevel<3){
        console.log(get_current_timestamp()+this.separator+"[info] ",...text);
      }
    }
    public warning(...text: (string|number|object)[]): void{
      if(this.logLevel<4){
        console.log(get_current_timestamp()+this.separator+"[WARNING] ",...text);
      }
    }
    error(...text: (string|number|object)[]): void{
      console.log(get_current_timestamp()+this.separator+"["+this.wrapColor("red","ERROR")+"]"+
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






