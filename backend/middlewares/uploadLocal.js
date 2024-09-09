import multer from "multer";

// non serve installare path
import path from 'node:path'

// versione base
// const uploadLocal = multer({ dest: 'uploads'})

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname))
    }
})

const uploadLocal = multer({ storage })

export default uploadLocal;