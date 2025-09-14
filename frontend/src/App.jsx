import { MyContext } from './MyContext.jsx'
import { useState } from 'react'
import SideBar from './SideBar.jsx'
import ChatWindow from './ChatWindow.jsx'
import './App.css'
import {v1 as uuidv1} from 'uuid';




function App() {
      let [prompt,setPrompt]=useState("");
      let [reply,setReply]=useState("");
      let [currThreadId,setCurrThreadId]=useState(uuidv1());
      let [prevChats,setPrevChats]=useState([]); //stores all chats of current threads
      let [newChat,setNewChat]=useState(true);
      let [allThreads,setAllThreads]=useState([]);

  let providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    prevChats,setPrevChats,
    newChat,setNewChat,
    allThreads,setAllThreads
  };


  return (
    <div className='main'>
      <MyContext.Provider value={providerValues}>
      <SideBar/>
      <ChatWindow/>
      </MyContext.Provider>
    </div>
  )
}

export default App
