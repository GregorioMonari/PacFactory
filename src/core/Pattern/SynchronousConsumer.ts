import { CachedConsumer } from "./CachedConsumer"
import { BindingsResults, ParsedBinding } from "../sepa/BindingsResults";
var log = require("greglogs").default

export class SynchronousConsumer extends CachedConsumer{
  private flagname;
  private flagBindings;

  constructor(
    jsap_file:any,
    queryname:string,
    sub_bindings: ParsedBinding,
    flag_queryname:string,
    flag_bindings: ParsedBinding,
    ignore_first_results:boolean
  ){
    super(jsap_file,queryname,sub_bindings,ignore_first_results);
    this.flagname=flag_queryname; //trigger flag
    this.flagBindings=flag_bindings;
  }

  public getFlagQueryName(){
    return this.flagname
  }
  public getFlagBindings(){
    return this.flagBindings
  }

  //@OVERRIDE
  async subscribeToSepa(){
    this.subscribeAndNotify(this.getConsumerQueryName(),this.getConsumerBindings(),
        "onAddedResults","onFirstResults","onRemovedResults","onError"
        );
    this.subscribeAndNotify(this.geFlagQueryName(),this.getFlagBindings(),
    "onSyncFlag","onFlagFirstResults","onFlagRemovedResults","onFlagError"
    );
  }

  onSyncFlag(res: BindingsResults):void{
    for(const flagBinding of res.getBindings()){
      log.debug("Added results:",flagBinding);
      this.getEmitter().emit("newsyncflag",flagBinding)
      this.RESET_SYNCHRONIZATION_FLAG({flag:flagBinding.flag})
    }

  }
  onFlagFirstResults(res: BindingsResults):void{
    if(this.firstResultsIgnored()){
      this.onSyncFlag(res)
    }
  }
  onFlagRemovedResults(res: BindingsResults):void{
    log.debug("Removed results:",res.getBindings());
    this.getEmitter().emit("flagremovedResults",res)
  }
  onFlagError(err:any){
    throw new Error(`Error from ${this.getFlagQueryName} consumer: ${err}`)
  }


  //override add binding to cache and remove binding from cache

}

//module.exports = SynchronousConsumer;