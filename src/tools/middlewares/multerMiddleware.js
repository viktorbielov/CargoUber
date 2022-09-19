const multer = require('multer');
const uuid = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + '.jpg');
    }
});

const upload = multer({storage});

module.exports = {
    upload
};