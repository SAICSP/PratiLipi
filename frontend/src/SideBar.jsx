import './SideBar.css'
import { useContext, useEffect, useState } from 'react';
import { MyContext } from './MyContext.jsx';
import { v1 as uuidv1 } from 'uuid';

function SideBar() {
  const {
    allThreads,
    setAllThreads,
    setNewChat,
    setPrompt,
    setReply,
    currThreadId,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const [isOpen, setIsOpen] = useState(false); // 👈 sidebar toggle state

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log("somethin went wront", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []); // 👈 add [] to prevent infinite fetch loop

  const createNewChat = async () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setIsOpen(false); // close sidebar after creating new chat
  };

  const changeThread = async (newthreadId) => {
    setCurrThreadId(newthreadId);
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${newthreadId}`)
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
      setIsOpen(false); // close sidebar after selecting thread
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
      const res = await response.json();
      console.log(res);
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <i className="fa-solid fa-bars"></i>
      </button>

      <section className={`sidebar ${isOpen ? "open" : ""}`}>
        <button onClick={createNewChat}>
          <img src="src/assets/blacklogo.png" alt="" className='logo' />
          <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>

        <ul className='history'>
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        <div className="sign">
          <p>By Sai Prakash</p>
        </div>
      </section>
    </>
  );
}

export default SideBar;
