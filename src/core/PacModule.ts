//import {JsapApi, SEPA} from '@arces-wot/sepa-js'//jsap api
const JsapApi =  require('@arces-wot/sepa-js').Jsap;
var log = require("greglogs").default
import { ARBindingsResults, SepaResponse } from "./sepa/ARBindingsResults";

/**
 * # PAC MODULE
 * Generic class which implements helper functions for jsapApi
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
   * Initializes a subscription.
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








  /*

  get subscriptionsArray(){
    return this._ACTIVE_SUBSCRIPTIONS_ARR
  }

  exit(){
    //process.exit()
    for(var i in this._ACTIVE_SUBSCRIPTIONS_ARR){
      this._ACTIVE_SUBSCRIPTIONS_ARR[i].unsubscribe()
    }
    this._ACTIVE_SUBSCRIPTIONS_ARR=[]
    log.info("CLOSED ALL SUBSCRIPTIONS")
  }

  //=============SEPA CLIENT=============
  async testSepaSource(){
    var queryRes=await this.rawQuery('select * where {graph <http://www.vaimee.it/testing/'+this.testingGraphName+'> {?s ?p ?o} }');
    log.info("Connected to Sepa")
  }


  async subscribeAndNotify(queryname,data,added,first,removed,error){
    var firstResults=true;
    var sub = this[queryname](data);
    sub.on("subscription",console.log)
    sub.on("notification",async (not)=>{
      //console.log("NOTIFICATION RECEIVED")
      if(!firstResults){
        //If removed results are present, call remove first
        if(this._isRemovedResults(not)){
          const bindings=this.extractRemovedResultsBindings(not);
          log.trace(`### ${queryname}: removed results received (${bindings.length}) ###`)
          for(var i=0;i<bindings.length;i++){
            try{
              await this[removed](bindings[i]);
            }catch(e){console.log(e)}
          }
        }
        //console.log(not)
        const bindings=this.extractAddedResultsBindings(not);
        log.trace(`### ${queryname}: added results received (${bindings.length}) ###`)
        for(var i=0;i<bindings.length;i++){
          await this[added](bindings[i]);
        }
      }else{
        //console.log("Reading first results")
        firstResults=false;
        var bindings=this.extractAddedResultsBindings(not);
        //this.saveUpdateTemplate(JSON.stringify(not))
        log.trace(`### ${queryname}: first results received (${bindings.length}) ###`)
        for(var i=0;i<bindings.length;i++){
          try{
            this[first](bindings[i]);
          }catch(e){console.log(e)}
        }
      }
    });
    sub.on("error",err=>{
      this[error](err);
    });
    this._SUBARR.push(sub)
    log.info("Sub and Notify Router initialized ("+queryname+")")
  }

  newSubRouter(queryname,data,callback,ignore_first_results){
    var firstResults=true;
    if(ignore_first_results==true){
      firstResults=false;
    }
    var sub = this[queryname](data);
    sub.on("subscription",console.log)
    sub.on("notification",not=>{
      if(!firstResults){
        if(!this._isRemovedResults(not)){
          var bindings=this.extractAddedResultsBindings(not);
          log.trace(`### ${queryname}: added results received (${bindings.length}) ###`)
          for(var i=0;i<bindings.length;i++){
            this[callback](bindings[i]);
          }
        }else{
          log.warning("Ignored removed results")
        }
      }else{
        firstResults=false;
        
        var bindings=this.extractAddedResultsBindings(not);
        //this.saveUpdateTemplate(JSON.stringify(not))
        log.trace(`### ${queryname}: first results received (${bindings.length}) ###`)
        for(var i=0;i<bindings.length;i++){
          this[callback](bindings[i]);
        }
      }
    });
    this._SUBARR.push(sub)
    log.info("Sub Router initialized ("+queryname+")")
  }




  //==================EXPRESS ROUTERS======================
  newGetRouter(path,callback){
    this.app.get(path, jsonParser, (req, res) => {
      this[callback]({req:req,res:res})
    });
    log.info("GET Router initialized ("+path+")")
  }

  newPostRouter(path,callback){
    this.app.post(path, jsonParser, (req, res) => {
      this[callback]({req:req,res:res})
    });
    log.info("POST Router initialized ("+path+")")
  }

  newDeleteRouter(path,callback){
    this.app.delete(path, jsonParser, (req, res) => {
      this[callback]({req:req,res:res})
    });
    log.info("DELETE Router initialized ("+path+")")
  }

  //listen to requests es.1357
  listen(node_port){
    this.app.listen(node_port, () => {
      log.info('Listening from port: '+node_port);
    });
  }







  //==============================================UTILITY==============================================
  saveUpdateTemplate(template){
    fs.writeFile('sparqlupdate.txt', template, function (err) {
      if (err) return console.log(err);
      console.log('FILE SAVED');
    });
  }


  _isRemovedResults(not){
    //var AddL=not.addedResults.results.bindings.length;
    var RemL=not.removedResults.results.bindings.length;
    if(RemL!=0){
      return true
    }else{
      return false
    }
  }

  rawUpdate(updatetext){
    //console.log(updatetext)
    
    return new Promise(resolve=>{
      this.basicSepaClient.update(updatetext)
          .then((res)=>{
            resolve(res)
          })
    })
  }
  rawQuery(querytext){
    return new Promise(resolve=>{
      this.basicSepaClient.query(querytext)
          .then((res)=>{
            resolve(res)
          })
    })
  }

  debugTableSlice(data,limit){
    console.warning("DEPRECATED,WILL SOON BE REMOVED")
    log.debug(`Showing ${limit} of ${data.length} rows:`)
    console.table(data.slice(0,limit))
  }
  extractAddedResultsBindings(subRes){
    var rawBindings=subRes.addedResults.results.bindings;
    //console.log(rawBindings)
    var bindings=[];
    var rawCell={};
    var cell={};
    Object.keys(rawBindings).forEach(k => {
      //cell={}
      rawCell=rawBindings[k];//extract single rawcell
      Object.keys(rawCell).forEach(field=>{
        cell[field]=rawCell[field].value;
      });
      bindings[k]=cell;//assign cell to bindings array
      cell={};
      rawCell={};
    });
    return bindings
  }
  extractRemovedResultsBindings(subRes){
    var rawBindings=subRes.removedResults.results.bindings;
    var bindings=[];
    var rawCell={};
    var cell={};
    Object.keys(rawBindings).forEach(k => {
      rawCell=rawBindings[k];//extract single rawcell
      Object.keys(rawCell).forEach(field=>{
        cell[field]=rawCell[field].value;
      });
      bindings[k]=cell;//assign cell to bindings array
      cell={};
      rawCell={};
    });
    return bindings
  }
  extractResultsBindings(queryRes){
    var rawBindings=queryRes.results.bindings;
    var bindings=[];
    var rawCell={};
    var cell={};
    Object.keys(rawBindings).forEach(k => {
      rawCell=rawBindings[k];//extract single rawcell
      Object.keys(rawCell).forEach(field=>{
        cell[field]=rawCell[field].value;
      });
      bindings[k]=cell;//assign cell to bindings array
      cell={};
      rawCell={};
    });
    return bindings
  }


  //!DEPRECATED
  sparqlQuery(queryname,data){
    console.warning("sparql query method is deprecated, will soon be removed")
    return new Promise(resolve=>{
      var sub =this[queryname](data);
      sub.on("notification",not=>{
        sub.unsubscribe();
        //log.debug("# Notification Received! (id: \""+queryname+"\") #");
        var bindings=this.extractAddedResultsBindings(not);
        resolve(bindings);
      });
    })
  }
  */
}//---------------------------------------------------------END OF PAC FACTORY----------------------------------------------------

//module.exports=PacModule