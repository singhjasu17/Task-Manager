const mongoose=require('mongoose');
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')
const userSchema=new mongoose.Schema({
    name:{
    type:String,
    required:true,
    trim:true,
},
email:
{
    type:String,
    unique:true,
    required:true,
    trim:true,
    lowercase:true,
    validate(value)
    {
        if(!validator.isEmail(value))
        {
            throw new Error('Email is invalid');
        }
    }
},
password:
{
    type:String,
    trim:true,
    required:true,
    
    validate(value)
    {
        if(value.includes('password'))
        {
            throw new Error('Set a different Password');
        }
        if(value.length<6)
        {
            throw new Error('Min length of password should be 6');
        }
    }
},
age:
{
    type:Number,
    default:0,
    validate(value)
    {
        if(value<0)
        {
            throw new Error('Age must be a positive Numeber');
        }
    }
},
avatar:
{
    type:Buffer
},
   tokens:[{
        token:{type:String,required:true}
}] },
{
    timestamps:true
})

userSchema.virtual('tasks',
{type:mongoose.Schema.Types.ObjectId,
    ref:'tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.generateWebToken=async function()
{
    const user=this;
    const token=await jwt.sign({_id:user._id.toString()},'thisismynewcourse')
    user.tokens=user.tokens.concat({token});
    await user.save();
    return token;
}
userSchema.methods.getPublicProfile=async function()
{
    const user=this;
    const userObject=user.toObject();
    delete userObject.password
    delete userObject.tokens
    return userObject;
}

userSchema.statics.findByCredentials=async function(email,password)
{
    const user=await User.findOne({email});
    if(!user)
    {
        throw new Error('Unable to Login');
    }
    const isValid=await bcrypt.compare(password,user.password)
    if(!isValid)
    {
        throw new Error('Unable to Login');
    }
    return user;
}
userSchema.pre('remove',async function(next)
{
    const user=this;
    await Task.deleteMany({owner:user._id});
    next();
})
userSchema.pre('save',async function(next)
{
    const user=this;
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8);

    }
    next();
})
var User=mongoose.model('User' ,userSchema);
 module.exports=User;