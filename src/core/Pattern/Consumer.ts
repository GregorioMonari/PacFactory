import { PacModule} from "../PacModule"
import { BindingsResults , ParsedBinding } from "../sepa/BindingsResults";
const EventEmitter = require("events").EventEmitter
var log = require("greglogs").default
/**
 * ### Consumer
 * Create a consumer:
 * ```
 * const queryName="ALL_USERNAMES";
 * const bindings={};
 * let consumer= new Consumer(jsap,queryName,bindings)
 * ```
 * 
 * A Consumer contains an event emitter that fires on: first,added and received results. The event emitter can be listened to react to a notification:
 * ```
 * consumer.getEmitter().on("firstResults",(not)=>{
 *     console.log(not)
 * })
 * consumer.getEmitter().on("addedResults",(not)=>{
 *     console.log(not)
 * })
 * consumer.getEmitter().on("removedResults",(not)=>{
 *     console.log(not)
 * })
 * ```

 * Alternatively, a new Class that extends the Consumer can be created to implement a custom consumer:
 * ```
 * class MyConsumer extends Consumer{
 *     constructor(jsap){
 *         super(jsap,"MY_QUERY_NAME")
 *     }
 * 
 *     //@Override
 *     onFirstResults(not){
 *         console.log(not)
 *     }
 *     //@Override
 *     onAddedResults(not){
 *         console.log(not)
 *     }
 *     //@Override
 *     onRemovedResults(not){
 *         console.log(not)
 *     }
 * }
 * ```
 * 
 * 
 * After declaring the event listeners, the consumer needs to subscribe to sepa to begin receiving notifications:
 * ```
 * consumer.subscribeToSepa()
 * ```
 */
export class Consumer extends PacModule{
  private queryname: string;
  private sub_bindings: ParsedBinding
  private notificationEmitter:any;

  constructor(jsap:any, queryname: string, sub_bindings: ParsedBinding){
    super(jsap);
    this.queryname=queryname;
    this.sub_bindings=sub_bindings;
    this.notificationEmitter=new EventEmitter();
  }

  public getEmitter():any{
    return this.notificationEmitter
  }

  public getConsumerQueryName():string{
    return this.queryname
  }
  public getConsumerBindings(): ParsedBinding{
    return this.sub_bindings
  }

  public async test(): Promise<boolean>{

    this.subscribeToSepa()
    

    return true
  }

  public subscribeToSepa(){
    this.startSubscription(this.queryname,this.sub_bindings,
        "onAddedResults","onFirstResults","onRemovedResults","onError"
        );
  }

  //TODO:WARNING, WORKS ONLY WITH MODIFIED JSAP CLASS (configs need to accept sparql11protocol)
  //@OVERRIDE
  async querySepa(){
    const queryName: string=this.getConsumerQueryName()
    const bindings: ParsedBinding=this.getConsumerBindings()
    var res: any=await this[queryName].query(bindings)
    res=this.extractResultsBindings(res)
    return res
  }
  async querySepaWithBindings(override_bindings: ParsedBinding){
    const queryName=this.getConsumerQueryName()
    const bindings=override_bindings;
    var res: any=await this[queryName].query(bindings)
    res=this.extractResultsBindings(res)
    return res  
  }
  extractResultsBindings(queryRes:any){
    var rawBindings=queryRes.results.bindings;
    var bindings:any=[];
    var rawCell:any={};
    var cell:any={};
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


  onFirstResults(res: BindingsResults):void{
    log.debug("First results:",res.getBindings());
    this.getEmitter().emit("firstResults",res)
  }
  onAddedResults(res: BindingsResults):void{
    log.debug("Added results:",res.getBindings());
    this.getEmitter().emit("addedResults",res)
  }
  onRemovedResults(res: BindingsResults):void{
    log.debug("Removed results:",res.getBindings());
    this.getEmitter().emit("removedResults",res)
  }
  onError(err:any){
    throw new Error(`Error from ${this.queryname} consumer: ${err}`)
  }



}


//module.exports=Consumer;