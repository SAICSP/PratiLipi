import {ScaleLoader} from 'react-spinners'
import { MyContext } from './MyContext.jsx';
import './ChatWindow.css'
import Chat from './Chat.jsx'
import { useContext,useState,useEffect } from 'react';


function ChatWindow() {
    let {       prompt,
                setPrompt,
                reply,
                setReply,
                currThreadId,
                setPrevChats,
                setNewChat,
        }=useContext(MyContext);

    let [load,setLoad]=useState(false);
    const [isOpen,setIsOpen]=useState(false);

    let getReply = async()=>{
        setNewChat(false);
        setLoad(true);

        console.log("message",prompt,"threadId",currThreadId);

        let options={
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                message:prompt,
                threadId:currThreadId
            })
        }

        try{
            const response = await fetch("https://pratilipibackend.onrender.com/api/chat", options);
            const data=await response.json();
            console.log(data.reply);
            setReply(data.reply);
        }catch(err){
            console.log(err);
        }

        setLoad(false);
    }

    //append new chat to previous chat
   useEffect(()=>{
    if(prompt && reply){
        setPrevChats(prevChats => [
            ...prevChats,
            { role: "user", content: prompt },
            { role: "assistant", content: reply }
        ]);
    }
    setPrompt("");
},[reply]);


const handleUserClick=()=>{
    setIsOpen(!isOpen);
}

    return (
    <div className='chatwindow'>
        
        <div className='navbar'>
            <span className='gpttext'>ChatGPT<i className="fa-solid  fa-chevron-down"></i></span>
            <div className="userIconDiv" onClick={handleUserClick}>
                {/* <span className='userIcon'><i className="fa-solid fa-user"></i></span> */}
                
                </div>
            </div>
            {/* {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItems"><i className="fa-solid fa-gear"></i>Settings</div>
                    <div className="dropDownItems"><i className="fa-solid fa-cloud-arrow-up"></i>Upgrade</div>
                    <div className="dropDownItems"><i className="fa-solid fa-right-from-bracket"></i>Logout</div>
                </div>
            } */}
        <Chat/>
        <div className="scales">
        <ScaleLoader loading={load} color="#fff"  ></ScaleLoader> 
        <ScaleLoader loading={load} color="#fff"  ></ScaleLoader> 
        <ScaleLoader loading={load} color="#fff"  ></ScaleLoader> 
        <ScaleLoader loading={load} color="#fff"  ></ScaleLoader> 
        <ScaleLoader loading={load} color="#fff"  ></ScaleLoader> 
        <ScaleLoader loading={load} color="#fff"  ></ScaleLoader> 
        <ScaleLoader loading={load} color="#fff"  ></ScaleLoader> 
        <ScaleLoader loading={load} color="#fff"  ></ScaleLoader> 
        

        </div>
        
        <div className='chatInput'>
            <div className="inputBox">
                <input
                    type="text"
                    placeholder="Ask Anything"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            getReply();
                                }
    }}
/>

                <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
            </div>
            <p className="info">
            ChatGPT can make mistakes. Check important info. See Cookie Preferences.
            </p>
        </div>

        </div>
    );
}

export default ChatWindow;