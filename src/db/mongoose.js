const mongoose=require('mongoose');

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useCreateIndex:true
})

var tasks=mongoose.model('ta',
{
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:
    {
        type:Boolean,
        default:false,
        required:false
    }
})
