import { BindingsResults, SepaBindingsResults } from "./BindingsResults";

export interface SepaResponse{
    spuid: string;
    alias: string;
    sequence: number;
    addedResults: SepaBindingsResults;
    removedResults: SepaBindingsResults;
}


export class ARBindingsResults {

    private _results: SepaResponse;

    constructor(results: SepaResponse){
      this._results=results
    }

    get spuid():string{
      return this.spuid;
    }

    get alias():string{
      return this.alias
    }

    get addedResults(): BindingsResults{
      const bindings=this._results.addedResults;
      var res= new BindingsResults(bindings)
      return res
    }
    get removedResults(): BindingsResults{
      const bindings=this._results.removedResults;
      var res= new BindingsResults(bindings)
      return res
    }

    

}