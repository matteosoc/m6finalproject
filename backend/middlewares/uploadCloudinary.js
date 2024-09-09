// npm i cloudinary multer-storage-cloudinary

import multer from "multer";
import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";


// configurazione e creazione del cloud
export const uploadCloudinaryAvatar = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'avatar', // cartella di destinazione
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        }
    })
})

export const uploadCloudinaryCover = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'cover', // cartella di destinazione
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        }
    })
})