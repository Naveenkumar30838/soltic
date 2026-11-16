// requires aws s3 client and multer 
import dotenv from "dotenv";
dotenv.config();

import { S3Client } from "@aws-sdk/client-s3";
const s3 = new S3Client({
    endpoint:process.env.B2_ENDPOINT,
    region:process.env.B2_REGION,
    credentials:{
        accessKeyId:process.env.B2_KEY_ID,
        secretAccessKey:process.env.B2_APPLICATION_KEY
    }
});
export default s3; 


