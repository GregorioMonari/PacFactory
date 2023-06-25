var Consumer=require('../Consumer');

class UserActivityTypesConsumer extends Consumer{
    constructor(jsap,email){
        super(jsap,"OVERRIDE_USER_ACTIVITY_TYPES",{
            usergraph:"http://www.vaimee.it/my2sec/"+email
        },false)
    }
}

module.exports=UserActivityTypesConsumer