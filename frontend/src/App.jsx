import { BrowserRouter as Router , Routes,Route , Navigate} from 'react-router-dom'
import Chat from "./components/chat.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import Profile from "./components/profile.jsx";
import AddTrip from './components/addTrip.jsx';
function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" ></Navigate>}></Route>
        <Route path='/login' element={<Login></Login>}/>
        <Route path='/signup' element={<Signup></Signup>}/>
        <Route path='/profile/:username' element={<Profile></Profile>} />
        <Route path='/chat/:chatId' element={<Chat></Chat>}/>
        <Route path="/addTrip" element={<AddTrip />} />
        <Route path="*" element={<div> <h1>404! Page Not Found <hr /><br /></h1> <p> <a href="http://localhost:5173/login">Login In to See more </a></p> </div>} />
      </Routes>
    </Router>
  )
}
export default App;