// import { useState , useEffect , useRef } from 'react'
// import ReactMarkdown from 'react-markdown'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import axios from 'axios'
// function App() {
//   const [response, setresponse] = useState([{"message": "", "response":""}])
//   const [message , setmessage] = useState("")
//   const responseRef = useRef(null)

//   const getresponse = async (id="newchat")=>{
//     const res = await axios.post(`http://localhost:5000/c/${id}` , {message});
//     console.log("Current response is : ")
//     console.log(response)
//     setresponse([...response , {"message":res.data.message , "response":res.data.response}])
//     return res;
//   }
  
//   const handleSubmit = async(e )=>{
//     e.preventDefault();
//     await getresponse();
//     setmessage("");

//   }
//   useEffect(() => {
//     if (responseRef.current) {
//       responseRef.current.scrollTop = responseRef.current.scrollHeight;
//     }
//   }, [response]);


//   return (
//     <>
//       <div className="header">

//       </div>

//       <div className='response' ref={responseRef} style={{ backgroundColor: "transparent", width: "80vw", height: "80vh", margin: "20px auto", padding: "20px", borderRadius: "12px", overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none", display: "flex", flexDirection: "column" }}>
//         {response.map((chat, index) => {
//           if (chat["message"] !== "") {
//             return (
//               <div key={index} style={{ marginBottom: "20px" }}>
//                 {/* User message Box */}
//                 <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px", marginRight: "5px" }}>
//                   <div style={{ backgroundColor: "#0084ff", color: "white", padding: "8px 12px", borderRadius: "18px", maxWidth: "60%", wordWrap: "break-word" }}>
//                     <p style={{ margin: 0 }}>{chat["message"]}</p>
//                   </div>
//                 </div>
//                 {/* Message Response Box */}
//                 <div style={{ display: "flex", justifyContent: "flex-start", marginLeft: "5px" }}>
//                   <div style={{ backgroundColor: "#3a3a3a", color: "#e0e0e0", padding: "12px 16px", borderRadius: "18px", maxWidth: "100%", wordWrap: "break-word" }}>
//                     {/* <p style={{ margin: 0 }}>{chat["response"]}</p> */}
//                     <ReactMarkdown>{chat.response}</ReactMarkdown>
//                   </div>
//                 </div>
//               </div>
//             );
//           }
//         })}

//         {/* Message Box */}
//           <div className="message-box" > 
//               <form onSubmit={handleSubmit} style={{position:"fixed", bottom:"30px", left:"10vw", width:"80vw", display:"flex", alignItems:"center", gap:"10px" }}>
//                 <input type="text" onChange={(e)=>{ setmessage(e.target.value)}} value={message} placeholder='Type Here' style={{width:"100%", border:"none", height:"45px", borderRadius:"24px", padding:"0 20px", fontSize:"16px", outline:"none", boxShadow:"4px 2px 8px rgba(0,0,0,0.2)"}}/>
//                 <button type="submit" style={{backgroundColor:"#0084ff", color:"white", border:"none", borderRadius:"50%", width:"45px", height:"45px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:"0", boxShadow:"2px 2px 8px rgba(0,0,0,0.2)", fontSize:"20px"}}>➤</button>
//               </form>
//           </div>
         
//       </div>

     
//     </>
//   )
// }

// export default App


import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'
import axios from 'axios'

function App() {
  const [response, setresponse] = useState([])
  const [message, setmessage] = useState("")
  const [chatId, setChatId] = useState(`chat_${Date.now()}`) // Initialize with unique chat ID
  const responseRef = useRef(null)

  const getresponse = async () => {
    setresponse([...response, { "message": message, "response": "" }])
    // tempmessage = message;
    // setmessage("");
    const res = await axios.post(`http://localhost:5000/c/${chatId}`, { message });
    console.log("Current response is: ")
    console.log(response)
    setresponse([...response, { "message": res.data.message, "response": res.data.response }])
    return res;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return; // Prevent empty messages
    await getresponse();
    setmessage("");
  }

  const startNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    setChatId(newChatId);
    setresponse([]);
    console.log("Started new chat:", newChatId);
  }

  const clearCurrentChat = async () => {
    try {
      await axios.delete(`http://localhost:5000/c/${chatId}`);
      setresponse([]);
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
    <>
      <div className="header" style={{ 
        padding: "15px 20px", 
        backgroundColor: "#2a2a2a", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #444"
      }}>
        <h2 style={{ color: "white", margin: 0, fontSize: "18px" }}>
          💬 {chatId}
        </h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={startNewChat} style={{ backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
          >
            ➕ New Chat
          </button>
          <button 
            onClick={clearCurrentChat}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#da190b"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#f44336"}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className='response' ref={responseRef} style={{ 
        backgroundColor: "transparent", 
        width: "80vw", 
        height: "calc(80vh - 60px)", 
        margin: "20px auto", 
        padding: "20px", 
        borderRadius: "12px", 
        overflowY: "scroll", 
        scrollbarWidth: "none", 
        msOverflowStyle: "none", 
        display: "flex", 
        flexDirection: "column" 
      }}>
        {response.length === 0 ? (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%",
            color: "#888",
            fontSize: "18px",
            textAlign: "center"
          }}>
            <p>👋 Start a conversation by typing a message below!</p>
          </div>
        ) : (
          response.map((chat, index) => {
            if (chat["message"] !== "") {
              return (
                <div key={index} style={{ marginBottom: "20px" }}>
                  {/* User message Box */}
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "flex-end", 
                    marginBottom: "20px", 
                    marginRight: "5px" 
                  }}>
                    <div style={{ 
                      backgroundColor: "#0084ff", 
                      color: "white", 
                      padding: "8px 12px", 
                      borderRadius: "18px", 
                      maxWidth: "60%", 
                      wordWrap: "break-word" 
                    }}>
                      <p style={{ margin: 0 }}>{chat["message"]}</p>
                    </div>
                  </div>
                  {/* Message Response Box */}
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "flex-start", 
                    marginLeft: "5px" 
                  }}>
                    <div style={{ 
                      backgroundColor: "#3a3a3a", 
                      color: "#e0e0e0", 
                      padding: "12px 16px", 
                      borderRadius: "18px", 
                      maxWidth: "100%", 
                      wordWrap: "break-word" 
                    }}>
                      <ReactMarkdown>{chat["response"]}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })
        )}

        {/* Message Box */}
        <div className="message-box"> 
          <form 
            onSubmit={handleSubmit} 
            style={{
              position: "fixed", 
              bottom: "30px", 
              left: "10vw", 
              width: "80vw", 
              display: "flex", 
              alignItems: "center", 
              gap: "10px"
            }}
          >
            <input 
              type="text" 
              onChange={(e) => { setmessage(e.target.value) }} 
              value={message} 
              placeholder='Type Here' 
              style={{
                width: "100%", 
                border: "none", 
                height: "45px", 
                borderRadius: "24px", 
                padding: "0 20px", 
                fontSize: "16px", 
                outline: "none", 
                boxShadow: "4px 2px 8px rgba(0,0,0,0.2)"
              }}
            />
            <button 
              type="submit" 
              disabled={!message.trim()}
              style={{
                backgroundColor: message.trim() ? "#0084ff" : "#ccc", 
                color: "white", 
                border: "none", 
                borderRadius: "50%", 
                width: "45px", 
                height: "45px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                cursor: message.trim() ? "pointer" : "not-allowed", 
                flexShrink: "0", 
                boxShadow: "2px 2px 8px rgba(0,0,0,0.2)", 
                fontSize: "20px"
              }}
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App