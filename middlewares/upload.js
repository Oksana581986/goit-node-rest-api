import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";


const destination = path.resolve("tmp");

const storage = multer.diskStorage({
    destination, 
    filename: (req, file, callback) => {
        const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniquePrefix}_${file.originalname}`;
        callback(null, filename);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 5,
}

const fileFilter = (req, file, callback) => {
    const extension = file.originalname.split(".").pop();
    if(extension === "exe") {
        return callback(new HttpError(400, ".exe not valid extension format"));
    }
    callback(null, true);
};

const upload = multer({
    storage,
    limits,
    fileFilter,
});


// const processAvatar = async (req, res, next) => {
//     try {
//         if (!req.file) {
//             throw new HttpError(400, "No file uploaded");
//         }

//         const imagePath = path.join(destination, req.file.filename);
//         const image = await Jimp.read(imagePath);
//         await image.cover(250, 250).write(imagePath);

//         next();
//     } catch (error) {
//         next(error);
//     }
// };

export default upload;
// processAvatar
    