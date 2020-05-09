const User=require('../models/user')
const jwt=require('jsonwebtoken')
const auth=async (req,res,next)=>
{
    try{

    const token=req.header('Authorization').replace('Bearer ','');
    
    const data=await jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findOne({_id:data._id,'tokens.token':token})
    if(!user)
    {
        throw new Error('')
    }
    req.token=token;
    req.user = user;
        next()
}catch(E)
{
    res.status(401).send({'error':'Please Authenticate'});
}
}
module.exports=auth;