var log = require("greglogs").default
import { PacModule } from "../PacModule";

export interface UpdateBindings{
  [key: string]: string | number | string[] | number[];
}

/**
 * ### Producer
 * Create a producer:
 * `
 * const updateName="ADD_USER";
 * let producer= new Producer(jsap,updateName);
 * `
 * 
 * Update Sepa with forced bindings:
 * `
 * producer.updateSepa({
 *     usergraph: "http://vaimee.it/my2sec/defuser@vaimee.it",
 *     username: "defuser"
 * })
 * `
 * Alternatively, a new Class that extends the Producer can be created to implement a custom producer:
 * `
 * class MyProducer extends Producer{
 *     constructor(jsap){
 *         super(jsap,"MY_UPDATE_NAME")
 *     }
 *     //@Override
 *     updateSepa(data){
 *         ...
 *     }
 * }
 * `
 */
export class Producer extends PacModule{
  private updatename:string;
  constructor(jsap:any,updatename:string){
    super(jsap);
    this.updatename=updatename;
  }

  public getUpdateName():string{
    return this.updatename
  }

  async updateSepa(bindings:UpdateBindings){
    var failed=false;
    try{
      var forcedBindings=this.updates[this.updatename].forcedBindings;   
      
      if(Object.keys(forcedBindings).length==Object.keys(bindings).length){
        Object.keys(forcedBindings).forEach(fk=>{
          if(!bindings.hasOwnProperty(fk)){
            failed=true;
          }
        })
      }else{
        failed=true;
      }
    }catch(e){console.log(e)}

    if(failed){
        log.error("Bindings mismatch in update: "+this.updatename+", showing logs:")
        console.log("bindings: "+Object.keys(bindings).join(" - "))
        console.log("forcedBindings: "+Object.keys(forcedBindings).join(" - "))
        throw new Error(`Bindings mismatch`)
    }else{
      log.trace("Update bindings ok")
    }

    var res=await this[this.updatename](bindings)
    return res;
  }


  onError(err:any){
    throw new Error(`Error from ${this.getUpdateName} consumer: ${err}`)
  }

}

//module.exports = Producer;