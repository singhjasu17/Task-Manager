const mongoose=require('mongoose');
const validator=require('validator');
const taskSchema=mongoose.Schema({
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
            },
            owner:
            {
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'User'
            }
},
{
timestamps:true
})
var task=mongoose.model('tasks',taskSchema)
module.exports=task;