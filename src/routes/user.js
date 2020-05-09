const express=require('express');
const User=require('../models/user')
const router=new express.Router()
const auth=require('../middleware/middleware')
const multer=require('multer')
const sharp=require('sharp')
const {sendemail,cancelemail}=require('../emails/account')

router.post('/users',async (req,res)=>
{

    const user=new User(req.body)


    try{
        await user.save()
        const token=await user.generateWebToken();
        sendemail(user.email,user.name)
        res.status(201).send({user:await user.getPublicProfile(),token});
    }
    catch(err){
    res.status(400).send(err);
    }
})
const upload=multer({
    
    limits:
    {
        fileSize:1000000
    },
    fileFilter(req,file,cb)
    {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/))
        {
            return cb(new Error('Upload a jpg/jpeg/png file'))
        }
        return cb(undefined,true)
    }
})
// router.post('/users/me/avatar',auth,async(req,res)=>
// {
//     const buffer=await sharp(req.file.buffer).resize({widht:250,height:250}).png().toBuffer()
//     req.user.avatar=buffer;
//     await req.user.save()
//     res.send('avatarsaved')
// })
router.get('/users/:id/avatar',async(req,res)=>
{
    try{
        const id=req.params.id
        const user=await User.findById(id);
        if(!user || !user.avatar)
        {
            throw new Error('User not present or no avatar found')
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }
    catch(err)
{
res.status(400).send(err);
}
})
router.delete('/users/me/avatar',auth,async (req,res)=>
{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>
{
    const buffer=await sharp(req.file.buffer).resize({widht:250,height:250}).png().toBuffer()
    req.user.avatar=buffer;

    await req.user.save()
    res.send();
},(error,req,res,next)=>
{
    res.status(400).send({error:'Upload valid docs'})
})
router.get('/users/me',auth,async (req,res)=>
{
        res.send(await req.user.getPublicProfile());
    
})
router.get('/users/:id',async (req,res)=>
{
    const id=req.params.id;
    try{const user=await User.findById(id)
        if(!user)
        return res.status(404).send('No User Found')
        res.send({user:await user.getPublicProfile()});
    }
    catch(err){
    
        res.status(500).send(err)
    }
})
router.post('/users/logoutAll',auth,async(req,res)=>
{
    try{
        const user=req.user;
    user.tokens=[];
    await user.save()
    res.status(200).send('logged out of all sessions')
}
    catch(e)
    {
    res.status(500).send(e);
    }
})
router.post('/users/logout',auth,async (req,res)=>
{
    const user=req.user;
    try{
   req.user.tokens=user.tokens.filter((token)=>
    {
        return token.token!==req.token;
    })
    await req.user.save()
    res.send(req.user.getPublicProfile());
    }catch(e)
    {
        res.status(500).send(e);
    }
})
router.post('/users/login',async (req,res)=>
{
    try{
    const user=await User.findByCredentials(req.body.email,req.body.password)
    const token=await user.generateWebToken();
    res.send({user:await user.getPublicProfile(),token:token});
    }catch(e)
    {
        res.status(400).send('Please Login with correct credentials'+e);

    }
})
router.delete('/users/me',auth,async (req,res)=>
{
    try{
        await req.user.remove()
        cancelemail(req.user.email,req.user.name)
    res.send(req.user)
        }
    catch(e)
    {
        res.send(500).send();
    }
})
router.patch('/users/me',auth,async (req,res)=>
{   const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=>
    {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send({error:'invalid updates'})
    }
    
    try{
        const user=await req.user;
        console.log(user)
        await updates.forEach((update)=> user[update]=req.body[update]);
        await user.save();
    res.send(user.getPublicProfile());
}
catch(e)
{
    res.status(400).send(e);
}
})

module.exports=router;