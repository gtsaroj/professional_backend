import multer from "multer";
import fs from "fs"
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(process.cwd(), "public", "temp")
        cb(null, dest)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage: storage,
})