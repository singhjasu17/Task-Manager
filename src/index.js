const express=require('express');
require('./db/mongoose')
const Task=require('./models/task');

const User=require('./models/user');

const taskRouter=require('./routes/task')
const userRouter=require('./routes/user')
const multer=require('multer');


const port=process.env.port;
const app=express();
const upload=multer({
    dest:'images',
    limits:
    {
        fileSize:1000000
    },
    fileFilter(req,file,cb)
    {
        if(!file.originalname.match(/\.(doc|docx)$/))
        {
            return cb(new Error('Please upload a Word Document'))
        }
        cb(undefined,true);
    }
})
app.post('/upload',upload.single('upload'),(req,res)=>
{
    res.send()
},(error,req,res,next)=>
{
    res.status(400).send({error:'Upload valid docs'})
})
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


const jwt=require('jsonwebtoken')
const myfunction=async function()
{
    const string=await jwt.sign({_id:'sgasg'},'1234');
    console.log(string)
}
console.log(myfunction());






app.listen(port,(error,rew)=>
{
    console.log('Server is listening at port '+port);
    if(error)
    console.log(error);
})

// const bcrypt=require('bcryptjs');
// const myfunction=async()=>
// {
//     const password='red123'
//     const hashpassword=await bcrypt.hash(password,8);
//     console.log(hashpassword);
//     const imp=await bcrypt.compare(password,hashpassword);
//     console.log(imp)
// }
// myfunction()
