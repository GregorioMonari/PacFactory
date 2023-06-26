import { PacModule} from "../PacModule"
import { BindingsResults , ParsedBinding } from "../sepa/BindingsResults";
const EventEmitter = require("events").EventEmitter
var log = require("greglogs").default
/*###########################################
|| NAME: CONSUMER
|| AUTHOR: Gregorio Monari
|| DATE: 18/1/2023
############################################*/
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
    const queryName=this.getConsumerQueryName()
    const bindings=this.getConsumerBindings()
    var res=await this[queryName].query(bindings)
    res=this.extractResultsBindings(res)
    return res
  }
  async querySepaWithBindings(override_bindings: any){
    const queryName=this.getConsumerQueryName()
    const bindings=override_bindings;
    var res=await this[queryName].query(bindings)
    res=this.extractResultsBindings(res)
    return res  
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