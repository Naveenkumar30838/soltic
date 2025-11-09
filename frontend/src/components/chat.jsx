import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import './Chat.css'

export default function Chat() {
  const [response, setresponse] = useState([])
  const [message, setmessage] = useState("")
  const [chatId, setChatId] = useState(`chat_${Date.now()}`)
  const responseRef = useRef(null)

  const getresponse = async (userMessage) => {
    // Add user message to chat
    setresponse(prev => [...prev, { "message": userMessage, "response": "" }]);
    
    try {
      // Call API
      const res = await axios.post(`http://localhost:5000/c/${chatId}`, { 
        message: userMessage 
      });
      
      console.log("Current response is: ", res.data);
      
      // Update with bot response
      setresponse(prev => {
        // Remove the empty response and add the complete one
        const newResponses = [...prev];
        newResponses[newResponses.length - 1] = {
          message: userMessage,
          response: res.data.response
        };
        return newResponses;
      });
      
    } catch (error) {
      console.error("Error getting response:", error);
      setresponse(prev => {
        const newResponses = [...prev];
        newResponses[newResponses.length - 1] = {
          message: userMessage,
          response: "Sorry, something went wrong. Please try again."
        };
        return newResponses;
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    setmessage(""); // Clear input immediately
    
    await getresponse(userMessage);
  }

  const startNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    setChatId(newChatId);
    setresponse([]);
    setmessage(""); // Clear input on new chat
    console.log("Started new chat:", newChatId);
  }

  const clearCurrentChat = async () => {
    try {
      await axios.delete(`http://localhost:5000/c/${chatId}`);
      setresponse([]);
      setmessage(""); // Clear input on clear
      console.log("Cleared chat:", chatId);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  }

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h2 className="chat-title">💬 {chatId}</h2>
        <div className="button-container">
          <button onClick={startNewChat} className="btn btn-new-chat">
            ➕ New Chat
          </button>
          <button onClick={clearCurrentChat} className="btn btn-clear">
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Response Container */}
      <div ref={responseRef} className="response-container">
        {response.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p className="empty-title">
              <strong>Welcome to Travel Agent Chat!</strong>
            </p>
            <p className="empty-subtitle">
              Start a conversation by typing a message below
            </p>
          </div>
        ) : (
          <div className="chat-messages">
            {response.map((chat, index) => {
              if (chat["message"] !== "") {
                return (
                  <div key={index} className="message-group">
                    {/* User Message */}
                    <div className="user-message-container">
                      <div className="user-message">
                        <p>{chat["message"]}</p>
                      </div>
                    </div>

                    {/* Bot Response */}
                    {chat["response"] && (
                      <div className="bot-message-container">
                        <div className="bot-message">
                          <ReactMarkdown>{chat["response"]}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            onChange={(e) => setmessage(e.target.value)}
            value={message}
            placeholder="Type your message here..."
            className="message-input"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`submit-button ${!message.trim() ? 'disabled' : ''}`}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}