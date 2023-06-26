const PacModule=require("./build/core/PacModule.js").PacModule
const CachedConsumer=require("./build/core/Pattern/CachedConsumer.js").CachedConsumer
const Consumer=require("./build/core/Pattern/Consumer.js").Consumer
const SynchronousConsumer=require("./build/core/Pattern/SynchronousConsumer.js").SynchronousConsumer
const Producer= require("./build/core/Pattern/Producer.js").Producer

module.exports = {
    PacModule:PacModule,
    CachedConsumer:CachedConsumer,
    Consumer:Consumer,
    SynchronousConsumer: SynchronousConsumer,
    Producer: Producer
}