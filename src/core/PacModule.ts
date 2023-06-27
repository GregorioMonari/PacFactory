//import {JsapApi, SEPA} from '@arces-wot/sepa-js'//jsap api
const JsapApi =  require('@arces-wot/sepa-js').Jsap;
var log = require("greglogs").default
import { ARBindingsResults, SepaResponse } from "./sepa/ARBindingsResults";

/**
 * ## PAC MODULE
 * Generic class which implements helper functions for jsapApi.
 * The constructor requires a Jsap file in parsed Json format.
 * ### Included modules
 * - this.api (SEPA api)
 * - this.bench (QueryBench)
 * - this.extendedConfig
 */
export class PacModule extends JsapApi {
  private _ACTIVE_SUBSCRIPTIONS_ARR=new Map();
  //public log= new GregLogs("./resources/logger_config.json");

  constructor(jsap: object) {
    super(jsap);
  }

  /**
   * Unsubscribes the module from any active subscription, effectively stopping it.
   */
  public stop(){
    for(var k of this.activeSubscriptions.keys()){
      var currSub:any=this.activeSubscriptions.get(k)
      currSub.instance.unsubscribe()
      log.info("Unsubscribed from '"+currSub.name+"', alias: "+currSub.instance._alias+", spuid: "+currSub.instance._stream.spuid)
      this.activeSubscriptions.delete(k)
    }
  }

  get hostName(): string{
    return this.host
  }

  get updateProtocol(): string{
    return this.sparql11protocol.protocol;
  }

  get updatePort(): number{
    return parseInt(this.sparql11protocol.port)
  }

  get subscribeProtocol(): string{
    return this.sparql11seprotocol.protocol;
  }

  get subscribePort(): number{
    const protocol=this.subscribeProtocol
    return this.sparql11seprotocol.availableProtocols[protocol].port;
  }

  get extendedConfig(): object{
    return this.extended
  }

  get activeSubscriptions(): Map<string,any>{
    return this._ACTIVE_SUBSCRIPTIONS_ARR
  }

  /**
   * ## Subscribe to Sepa
   * **Subscribes** the module to an active **Sepa Engine**. Stop the module by calling the 'stop()' method.  
   * The Sepa connection parameters must be provided by the jsap file in the module constructor  
   * In addition, the callbacks stringified names of the callbacks functions for added,
   * removed and first results must be provided
   */
  async startSubscription(queryname: string,data: object,added: any,first: any,removed: any,error: any){
    var firstResults=true;
    var sub = this[queryname](data);
    log.info(`Subscribed to '${queryname}', alias: ${sub._alias}`)
    sub.on("notification",async (notification:SepaResponse)=>{
      log.debug("** Notification from \'"+queryname+"\' subscription received, alias: "+sub._alias+", spuid: "+sub._stream.spuid)
      log.trace(notification)
      let arBindings=new ARBindingsResults(notification)
      if(!firstResults){
        if(!arBindings.removedResults.isEmpty()) await this[removed](arBindings.removedResults)
        if(!arBindings.addedResults.isEmpty()) await this[added](arBindings.addedResults)
      }else{
        firstResults=false;
        await this[first](arBindings.addedResults)
      }
    });
    sub.on("error",(err:any)=>{
      this[error](err);
    });
    this.activeSubscriptions.set(sub._alias,{
      "name":queryname,
      "instance":sub
    })    
  }
}//---------------------------------------------------------END OF PAC MODULE----------------------------------------------------