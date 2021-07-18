const multer = require("multer");
const path = require("path");

const storage = (paths="img")=>multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/img", paths));
    },
    filename: function (req, file, cb) {
        cb(null, `${paths}-${Date.now()}-cover${path.extname(file.originalname)}`);
    },
});

const upload =(paths="")=> multer({
    storage:storage(paths),
});

exports.uploadSingleImage =(paths)=> upload(paths).single("img");

exports.uploadMultiImages =(paths)=> upload(paths).array("images", 3);

