import { BrowserRouter as Router , Routes,Route , Navigate} from 'react-router-dom'
import Chat from "./components/chat.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/singup.jsx";
import Profile from "./components/profile.jsx";
function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" ></Navigate>}></Route>
        <Route path='/login' element={<Login></Login>}/>
        <Route path='/signup' element={<Signup></Signup>}/>
        <Route path='/profile' element={<Profile></Profile>} />
        <Route path='/chat' element={<Chat></Chat>}/>
      </Routes>
    </Router>
  )
}
export default App;