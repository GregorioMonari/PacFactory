export interface ParsedBinding{
    [key: string]: string | number;
}

export interface Binding{
    [key: string]: {
        type:string;
        value:string;
    }
}

export interface Head{
    vars: string[];
}

export interface Results{
    bindings: Binding[];
}

export interface SepaBindingsResults{
    head:Head;
    results:Results;
};

export class BindingsResults implements SepaBindingsResults{
    private _head: {
        vars: string[];
    }
    private _results:{
        bindings: Binding[]
    }
    constructor(bindingsResults: SepaBindingsResults){
        this._head=bindingsResults.head;
        this._results=bindingsResults.results;
    }

    public get head():Head{
        return this._head
    }

    public get results():Results{
        return this._results
    }

    public getVars(): string[]{
        return this.head.vars;
    }
    public getBindings(): ParsedBinding[]{
        return this.parseBindingsValues(this.results.bindings)
    }
    //!SIZE IS SAFE BECAUSE IT DOES NOT PARSE THE BINDINGS!
    public size():number{
        return this.results.bindings.length;
    }

    public isEmpty():boolean{
        if(this.results.bindings==undefined || this.results.bindings == null){
            return true
        }
        if(this.size()==0){
            return true
        }else{
            return false
        }
    }


    private parseBindingsValues(resultsArr: Binding[]): ParsedBinding[]{
        var out:any=[];
        for(const binding of resultsArr){
            var parsedBinding:any={}
            for(const variable of this.getVars()){
                const value=binding[variable].value
                parsedBinding[variable]=value;
            }
            out.push(parsedBinding)
        }
        return out       
      }


}