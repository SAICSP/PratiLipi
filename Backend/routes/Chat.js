import express from 'express'
import getOPenAIAPIResponse from '../utils/OpenAI.js'
import Thread from '../models/Thread.js'
const router=express.Router();

router.post("/test",async(req,res)=>{
    try{
        const thread= new Thread({
            threadId:"1vd",
            title:"thread from server"
        })

    const  response=await thread.save();
    res.send(response);
    }

    catch(err){
        console.log(err);
        res.status(500).json({error:"INTERNAL SERVER ERROR"});
    }
})


router.post("/chat",async(req,res)=>{
    const {threadId,message}=req.body;

    if(!threadId || !message){
        res.status(400).json({error:"missing required fields"})
    }

    try{
        let thread=await Thread.findOne({threadId});


        if(!thread){//its a new chat create a new thread
            thread =new Thread({
                threadId:threadId,
                title:message,
                messages:[{role:"user",content:message}]
            });

        }else{ //its alread a created chat push now 
            thread.messages.push({role:"user",content:message});
        }

        const assistantReply=await getOPenAIAPIResponse(message);

        thread.messages.push({role:"assistant",content:assistantReply})
        thread.updatedAt=new Date();

        //save thread in db
        await thread.save();
        res.json({reply:assistantReply})
    }
    catch(err){
        console.log("error is  ",err);
        res.status(500).json({error:"something went wrong"})
    }
})


router.get("/thread",async (req,res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt:-1});
        //descending order of updatedAt .. most recent data on top 
        res.json(threads);
    }
    catch(err){
        res.status(500).json({error:"failed to fetch thread"})
    }
})


router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;  

    try {
        const thread = await Thread.findOne({ threadId });
        
        if (!thread) {
            return res.status(404).json({ error: "thread not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to fetch chat" });
    }
});



//delete route
router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;

    try{
        const deletedThread=await Thread.findOneAndDelete({threadId});


        if(!deletedThread){
            res.status(404).json({error:"thread not found"})
        }

        res.status(200).json({success:"thread deleted successfully"})
    }catch(err){
        res.status(500).json({error:"failed to delete thread"})
    }
})


export default router;