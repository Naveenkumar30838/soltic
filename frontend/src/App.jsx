import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
function App() {
  const [response, setresponse] = useState("Here is response")
  const [message , setmessage] = useState("")

  const getresponse = async (id="newchat")=>{
    const res = await axios.post(`http://localhost:5000/c/${id}` , {message});
    console.log("Response is : ")
    console.log(res)
    console.log(res.data['key1'])
    setresponse(res.data)
    return res;
  }
  
  const handleSubmit = async(e )=>{
    e.preventDefault();
    await getresponse();
    setmessage("");

  }
  // useEffect( () => {
  //   getresponse();
  // }, []);
  

  return (
    <>
      <div className="header">

      </div>

      <div className='response' style={{backgroundColor:"#232321a9" ,height:"100vw" , width:"80vw"    }}>
        {/* <p>{response}</p> */}
      </div>

      <div className="message-box">
        <form onSubmit={handleSubmit} >
          <input type="text" onChange={(e)=>{ setmessage(e.target.value)}} value={message} placeholder='Type Here' style={{width:"80vw" , border:"none",height:"40px" , borderRadius:"8px",position:"fixed",bottom:"30px",left:"10vw"}}/>
          <button type="submit" >submit</button>
        </form>
      </div>
    </>
  )
}

export default App
