import {PutObjectCommand} from "@aws-sdk/client-s3";
import express from "express";
import multer from "multer";
import s3 from "../uploader/backblaze_uploader.js";

const router = express.Router();
const upload = multer({
    storage:multer.memoryStorage()
})

router.post("/upload" , upload.single("image"), async (req,res) =>{
    const file = req.file;
    const key = `images/${Date.now()}-${file.originalname}`;
    await s3.send(
        new PutObjectCommand({
            Bucket:process.env.B2_BUCKET,
            Key:key,
            Body:file.buffer,
            ContentType:file.mimetype
        })
    );
    res.json({
        success:true,
        key
    })
})

export default router;