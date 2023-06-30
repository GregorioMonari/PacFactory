const JsapLoader= require("./build/utils/JsapLoader").JsapLoader
const Consumer= require("./build/core/Pattern/Consumer").Consumer
const Producer= require("./build/core/Pattern/Producer").Producer
const CachedConsumer= require("./build/core/Pattern/CachedConsumer").CachedConsumer
const SynchronousConsumer= require("./build/core/Pattern/SynchronousConsumer").SynchronousConsumer
const PacModule= require("./build/core/PacModule").PacModule
let jsapLoader= new JsapLoader();
const _jsap= jsapLoader.readFileAsJson("./resources/test.jsap");


test('Create instances', ()=>{
    let consumer=new Consumer(_jsap,"ALL_USERNAMES",{})
    let cachedConsumer=new CachedConsumer(_jsap,"ALL_USERNAMES",{},false)
    let synchronousonsumer=new SynchronousConsumer(_jsap,"ALL_USERNAMES",{},"GET_SYNCHRONIZATION_FLAG",{},false)
    let producer=new Producer(_jsap,"ADD_USER")
    let pacModule= new PacModule(_jsap)
    var testRes=true;
    if(consumer.host!=_jsap.host) testRes=false
    if(cachedConsumer.host!=_jsap.host) testRes=false
    if(synchronousonsumer.host!=_jsap.host) testRes=false
    if(producer.host!=_jsap.host) testRes=false
    if(pacModule.host!=_jsap.host) testRes=false

    expect(testRes).toBe(true)
})

test('Produce, Query and Remove', async ()=>{
    let producer=new Producer(_jsap,"ADD_USER")
    let remover=new Producer(_jsap,"REMOVE_USER")
    let consumer=new Consumer(_jsap,"ALL_USERNAMES",{})
    const usergraph="http://www.vaimee.it/my2sec/defuserjest@vaimee.it";

    await producer.updateSepa({
        usergraph:usergraph,
        username_literal:"defuserjest"
    })
    const addedRes=await consumer.querySepa();
    var foundAdded=false;
    for(const binding of addedRes){
        if(binding.s==usergraph){
            foundAdded=true;
            console.log(binding)
            break;
        }
    }

    expect(foundAdded).toBe(true)  
    
    await remover.updateSepa({
        usergraph:usergraph
    })
    const removedRes=await consumer.querySepa();
    var foundRemoved=false;
    for(const binding of removedRes){
        if(binding.s==usergraph){
            foundRemoved=true;
            console.log(binding)
            break;
        }
    }

    expect(foundRemoved).toBe(false)  
})

test('Cached Consumer', async ()=>{
    let producer=new Producer(_jsap,"ADD_USER")
    let remover=new Producer(_jsap,"REMOVE_USER")
    let consumer=new CachedConsumer(_jsap,"ALL_USERNAMES",{},false)
    consumer.subscribeToSepa()
    const usergraphs=[
        "http://www.vaimee.it/my2sec/defuserjest@vaimee.it",
        "http://www.vaimee.it/my2sec/defuserjest2@vaimee.it"
    ]
    const usernames=[
        "defuserjest",
        "defuserjest2"
    ]

    for(var i in usergraphs){
        await producer.updateSepa({
            usergraph:usergraphs[i],
            username_literal:usernames[i]
        })
    }

    //console.log("produced")
    var cache=consumer.cache;
    //console.log(cache)
    var testRes=false;
    if(cache.size>0){
        testRes=true
    }

    expect(testRes).toBe(true)   



    for(var i in usergraphs){
        await remover.updateSepa({
            usergraph:usergraphs[i]
        })
    }

    cache=consumer.cache;

    //expect(cache.size).toBe()  

    consumer.stop()

})