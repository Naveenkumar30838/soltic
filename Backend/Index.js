import express from "express";
import session from 'express-session'
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import { mainWithHistory } from "./apis.js";
import cors from 'cors'
import Chats from "./Model/chatModel.js";
import {connectMongo , conn} from "./config/db.js";
import authRoutes from './Routes/authRoutes.js';
import chatRoutes from './Routes/chatRoutes.js';
import profileRoutes from './Routes/profileRoutes.js';
import tripRoutes from './Routes/tripRoutes.js';
// import {  FEW_SHOT_EXAMPLES } from "./config/geminiConfig.js";

dotenv.config()
const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true,
  optionsSuccessStatus:200
}));

// Data base Connection  
connectMongo();


app.use(
  session({
    secret: process.env.MONGO_SECRET,             
    resave: false,                       
    saveUninitialized: false,            
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,       // 1 day
      httpOnly: true,
      secure: false,                     // set true only in HTTPS
    },
    store: MongoStore.create({// Required for persistently storing connect-mongo models 
      mongoUrl: process.env.MONGO_URI,   // Your MongoDB URL
      ttl: 24 * 60 * 60,                 // store sessions for 1 day
    }),
  })
);
// Routes :
app.use("/" , authRoutes);
app.use("/", profileRoutes);
app.use("/" , chatRoutes);
app.use("/" , tripRoutes);


app.get('/', (req, res) => {
  res.send("Home Page");
});

app.listen(process.env.PORT || 5000, () => 
  console.log(`Server running at Port ${process.env.PORT || 5000}`)
);