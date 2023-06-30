# PacFactory
A collection of semantic clients implementing the PAC architecture

## Introduction
PacFactory extends the standard [JsapApi](https://github.com/arces-wot/SEPA-js) used for semantic queries, introducing 4 semantic modules: 
- Producer
- Consumer
- CachedConsumer
- SynchronousConsumer

## Installation
<pre>
npm i pacfactory
</pre>

## Usage
Import semantic modules:
<pre>
const Producer = require('pacfactory').Producer;
const Consumer = require('pacfactory').Consumer;
const CachedConsumer = require('pacfactory').CachedConsumer;
const SynchronousConsumer = require('pacfactory').SynchronousConsumer;
</pre>

### Producer
Create a producer:
<pre>
const updateName="ADD_USER";
let producer= new Producer(jsap,updateName);
</pre>

Update Sepa with forced bindings:
<pre>
producer.updateSepa({
    usergraph: "http://vaimee.it/my2sec/defuser@vaimee.it",
    username: "defuser"
})
</pre>
Alternatively, a new Class that extends the Producer can be created to implement a custom producer:
<pre>
class MyProducer extends Producer{
    constructor(jsap){
        super(jsap,"MY_UPDATE_NAME")
    }
    //@Override
    updateSepa(data){
        ...
    }
}
</pre>

### Consumer
Create a consumer:
<pre>
const queryName="ALL_USERNAMES";
const bindings={};
let consumer= new Consumer(jsap,queryName,bindings)
</pre>

A Consumer contains an event emitter that fires on: first,added and received results. The event emitter can be listened to react to a notification:
<pre>
consumer.getEmitter().on("firstResults",(not)=>{
    console.log(not)
})
consumer.getEmitter().on("addedResults",(not)=>{
    console.log(not)
})
consumer.getEmitter().on("removedResults",(not)=>{
    console.log(not)
})
</pre>

Alternatively, a new Class that extends the Consumer can be created to implement a custom consumer:
<pre>
class MyConsumer extends Consumer{
    constructor(jsap){
        super(jsap,"MY_QUERY_NAME")
    }

    //@Override
    onFirstResults(not){
        console.log(not)
    }
    //@Override
    onAddedResults(not){
        console.log(not)
    }
    //@Override
    onRemovedResults(not){
        console.log(not)
    }
}
</pre>


After declaring the event listeners, the consumer needs to subscribe to sepa to begin receiving notifications:
<pre>
consumer.subscribeToSepa()
</pre>

### Cached Consumer
A Cached Consumer is an extension of a consumer. In addition to emitting an event on results, it contains a builtin Map, which can be used to temporarily store sepa notification, effectively acting as a buffer fo sparql notifications.
While the CachedConsumer constructor provides a basic implementation for the modules, it is recommended to implement a custom CachedConsumer which has its own caching logic.

Define a cached consumer with custom caching logic:
<pre>
class MyCachedConsumer extends CachedConsumer{
    constructor(jsap,ignore_first_results){
        super(jsap,"MY_QUERY_NAME",{},ignore_first_results)
    }
    //@Override
    add_bindings_to_cache(res: BindingsResults){
        for(let binding of res.getBindings()){
            if(!binding.hasOwnProperty("s")){console.log("Skipping binding, no 's' key detected"); continue}
            if(this.cache.has(binding.s)){
                console.log("Skipping binding, key already exists");
            }else{
                this.cache.set(binding.s,binding)
            }
            console.log(this.cache)
        }
    }
    //@Override
    remove_bindings_from_cache(res: BindingsResults){
        for(let binding of res.getBindings()){
            if(!binding.hasOwnProperty("s")){console.log("Skipping binding, no 's' key detected"); continue}
            if(!this.cache.has(binding.s)){
                console.log("Skipping binding, key does not exist");
            }else{
                this.cache.delete(binding.s)
            }
            console.log(this.cache)
        }
    }
}
</pre>

Create the CachedConsumer and subscribe:
<pre>
let cachedConsumer= new MyCachedConsumer(jsap,false)
cachedConsumer.subscribeToSepa();
</pre>

Get the internal cache:
<pre>
let cache= cachedConsumer.cache;
</pre>

### Synchronous Consumer
Similarly to the CachedConsumer, the SynchronousConsumer has an internal cache which gets updated on notification.
The difference is that the SynchronousConsumer has a second subscription: the SynchronizationFlag. 
The SyncFlag can be used to signal the end of a notification stream. Usually, the producer sends two or more messages containing triples, and the SyncConsumer starts caching the messages. Then, the producer sends a Production finished flag. The SyncConsumer provides a custom emitter for this event, the 'newsyncflag' event. 
Being an extension of a cached consumer, it is necessary to implement a custom caching logic and specify the syncflag bindings.
Define a SyncConsumer with custom flag and caching logic:
<pre>
class MySynchronousConsumer extends SynchronousConsumer{
    constructor(jsap,ignore_first_results){
        let queryName="MY_QUERY_NAME";
        let queryBindings={};
        let flagQueryName="GET_SYNC_FLAG";
        let flagQueryBindings={};
        super(jsap,queryName,queryBindings,flagQueryName,flagQueryBindings,ignore_first_results)
    }
    //@Override
    add_bindings_to_cache(res: BindingsResults){
        for(let binding of res.getBindings()){
            if(!binding.hasOwnProperty("s")){console.log("Skipping binding, no 's' key detected"); continue}
            if(this.cache.has(binding.s)){
                console.log("Skipping binding, key already exists");
            }else{
                this.cache.set(binding.s,binding)
            }
            console.log(this.cache)
        }
    }
    //@Override
    remove_bindings_from_cache(res: BindingsResults){
        for(let binding of res.getBindings()){
            if(!binding.hasOwnProperty("s")){console.log("Skipping binding, no 's' key detected"); continue}
            if(!this.cache.has(binding.s)){
                console.log("Skipping binding, key does not exist");
            }else{
                this.cache.delete(binding.s)
            }
            console.log(this.cache)
        }
    }
</pre>
Create a SynchronousConsumer:
<pre>
let syncConsumer= new MySynchronousConsumer(jsap,false)
</pre>

Listen to the syncflag event, then subscribe to sepa:
<pre>
syncConsumer.getEmitter().on("newsyncflag",(not)=>{
    let cache=syncConsumer.cache;
    console.log(cache)
})
syncConsumer.subscribeToSepa();
</pre>
