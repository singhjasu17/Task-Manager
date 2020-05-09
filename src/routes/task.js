const express=require('express')
const Task=require('../models/task');
const router=new express.Router();

const auth=require('../middleware/middleware')
router.post('/tasks',auth,async (req,res)=>
{
    const body=req.body;
    const obj={...body,owner:req.user._id}
    const task=new Task(obj);
    try{ await task.save()
        res.status(201).send(task);
    }catch(err){
    
        res.status(400).send(err);
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>
{
    const _id=req.params.id;
    try{
    const task=await Task.findOneAndDelete({_id,owner:req.user._id});
    if(!task)
    return res.status(404).send('No error to delete')
    res.send(task);
    }catch(e)
    {
        res.send(500).send();
    }
})

router.patch('/tasks/:id',auth,async (req,res)=>
{
    const allowedUpdates=['description','completed']
    const updates=Object.keys(req.body);
    const isValidOperation=updates.every((update)=>{ return allowedUpdates.includes(update)});
    if(!isValidOperation)
    return res.status(400).send({error:'Not a valid operation'})
    const _id=req.params.id;
    try{
        const task=await Task.findOne({_id,owner:req.user._id});

        if(!task)
        {
            return res.status(404).send('No task found');
        }
        updates.forEach((update)=> task[update]=req.body[update])
        await task.save()
        res.send(task);
    }catch(e)
    {
    res.status(400).send(e);
    }
})
router.get('/tasks',auth,async (req,res)=>
{
 const match={}
 const sort={}
        if(req.query.completed)
    {
        match.completed  =  req.query.completed === "true"
    }
    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]==='desc'?-1:1
    }
    try
    {
        // const tasks=await Task.find({owner:req.user._id,completed});
        await req.user.populate({path:'tasks',match,options:
    {
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
    }}).execPopulate();
        res.send(req.user.tasks);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
})
router.get('/tasks/:id',auth,async (req,res)=>
{
    const _id=req.params.id;
    try{
    const task= await Task.findOne({_id,owner:req.user._id});
        if(!task)
        return res.status(404).send("No task found with given id");
        res.send(task);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
}) 
module.exports=router;