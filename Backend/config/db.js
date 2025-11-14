import mongoose from "mongoose";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from 'fs'
dotenv.config();

const connectMongo= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Db Connected Successfully ")
    }catch(error){
        console.log("Mongo DB connection Failed");
        process.exit(1);
    }
}




// function updateDbConnection(){
//     conn = mysql.createConnection({
//         host:process.env.SQL_HOST,
//         user:process.env.SQL_USER,
//         password:process.env.SQL_PASSWORD,
//         database:process.env.SQL_DATABASE,
//         multipleStatements:true
//     })
//     conn.connect((err)=>{
//         if(err){
//             console.log("Error connecting MYSQL" );
//             return;
//         }
//         console.log("Connected MySQL Successfully");
//     })
// }

// let conn = mysql.createConnection({
//     host:process.env.SQL_HOST,
//     user:process.env.SQL_USER,
//     password:process.env.SQL_PASSWORD,
//     multipleStatements:true
// })

// conn.connect((err)=>{
//     if(err) return
//     // Check if there is a database mentioned in the env file(SQL_DATABASE) exists or not , if not let's create a database mentioned in the env file 
//     conn.query(`SHOW DATABASES LIKE 'soltic'` , (err , result)=>{
//         if(err){
//             console.log("Error in Query to Check whether Database Exists or not"  , err);    
//             return;
//         }
//         if(result.length===0){// database doesn't exist need to run the schema file 
//             const schema  = fs.readFileSync('./config/schema.sql' , 'utf8')
//             conn.query(schema , (err)=>{
//                 if(err){
//                     console.log("Error Creating the Database from the schema File:" , err)
//                     return;
//                 }
//                 conn.end((err)=>{
//                     if(err) return
//                 });
//                 updateDbConnection();
//             })
//         }else{// database exists update db 
//             conn.end((err)=>{
//                 if(err) return
//             });
//             updateDbConnection();
//         }
//     });
// })

// updateDbConnection();







// It is must that we require an database named soltic ( above code was trying to handle if the user is not having the database named soltic then it will create the database soltic with the given schema ) : 
const conn = await mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  multipleStatements: true,
});
console.log("My Sql Connected Successfully")
export  {connectMongo , conn};