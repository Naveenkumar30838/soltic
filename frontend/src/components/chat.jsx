import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";
import './Chat.css'

axios.defaults.withCredentials = true;

export default function Chat() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const {chatId : urlChatId}= useParams();

  const [response, setresponse] = useState([])
  const [message, setmessage] = useState("")
  const [chatId, setChatId] = useState(urlChatId);
  const responseRef = useRef(null)

  const [username, setUsername] = useState(null);   

  // AUTH CHECK + GET USERNAME
useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/`);
        if (!res.data || res.data.authenticated !== true) {
          return navigate("/login");
        }
        setUsername(res.data.username);    // save username for profile use
      } catch (err) {
        return navigate("/login");
      }
    };

    const getChatHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/c/${chatId}`, {
          withCredentials: true
        });
        if(res.data && res.data.status =="chat_not_found"){
          //create new chat , with own chatId
          console.log("Chat Not Found");
          const res2 = await axios.post(`${BASE_URL}/chat/create`)
          setChatId(res2.data.chatId);

          navigate(`/chat/${res2.data.chatId}` );
        }

        if (res.data && res.data.chat) {
          setresponse(res.data.chat); 
        }

      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    verifySession();
    getChatHistory();
  }, []); 


  
const getresponse = async (userMessage) => {
    setresponse(prev => [...prev, { message: userMessage, response: "" }]);
    try {
      const res = await axios.post(`${BASE_URL}/c/${chatId}`, { message: userMessage });
      setresponse(prev => {
        const newResponses = [...prev];
        newResponses[newResponses.length - 1] = {
          message: userMessage,
          response: res.data.response
        };
        return newResponses;
      });
    } catch (error) {
      setresponse(prev => {
        const newResponses = [...prev];
        newResponses[newResponses.length - 1] = {
          message: userMessage,
          response: "Sorry, something went wrong."
        };
        return newResponses;
      });
    }
  };


  //  PROFILE BUTTON HANDLER
  const openProfile = async () => {
    if (!username) return;
    try {
      console.log("Profile Clicked ");
      navigate(`/profile/${username}`, ); 
    } catch (err) {
      console.error("Profile fetch error", err);
    }
  };

  // LOGOUT

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`);
      navigate("/login");
    } catch (err) {
      console.log("Logout failed", err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const userMessage = message.trim();
    setmessage("");
    await getresponse(userMessage);
  };

  const startNewChat = async () => {
    const res = await axios.post(`${BASE_URL}/chat/create` , {} , {withCredentials:true});
    navigate(`/chat/${res.data.chatId}` );
  };

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div className="chat-container">

   
      {/* HEADER */}
      <div className="chat-header-modern">

        {/* Left Buttons */}
        <div className="header-left-modern">
          <button onClick={startNewChat} className="modern-btn primary">New Chat</button>
        </div>

        <h2 className="chat-title-modern">{chatId}</h2>

        {/* Right Buttons */}
        <div className="header-right-modern">
          <button className="modern-btn secondary" onClick={openProfile}>
            Profile
          </button>

          <button className="modern-btn danger-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>


      <div ref={responseRef} className="response-container">
        {response.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title"><strong>Welcome to Travel Agent Chat!</strong></p>
            <p className="empty-subtitle">Start a conversation below</p>
          </div>
        ) : (
          <div className="chat-messages">
            {response.map((chat, index) => (
              <div key={index} className="message-group">
                <div className="user-message-container">
                  <div className="user-message"><p>{chat.message}</p></div>
                </div>

                {chat.response && (
                  <div className="bot-message-container">
                    <div className="bot-message">
                      <ReactMarkdown>{chat.response}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            onChange={(e) => setmessage(e.target.value)}
            value={message}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" disabled={!message.trim()} className="submit-button">
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
