const MovieModel = require("./model.movie");
const { validationResult } = require("express-validator");

exports.getAllMovies = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                status: "error",
                message: errors.array()[0].msg,
            });
        }


        const limit = req.query.limit * 1 || 10;

        const page = ((req.query.page * 1)-1 )* limit || 0;
        console.log("page", page, "limit", limit)
        
        const movies = await MovieModel.find({}).skip(page).limit(limit);

        res.status(200).json({
            status: "success",
            movies,
        });
    } catch (err) {

        console.log("erro2", err)
        res.status(500).json({
            status: "error",
            err: err.message
        });
    }

}

exports.createMovie = async (req, res, next) => {
    try {
        console.log("here----------0")
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     res.status(400).json({
        //         status: "error",
        //         message: errors.array()[0].msg,
        //     });
        // }

        const body = req.body;
        console.log("here with body-------", body)

        if (req.file) {
            console.log("filename", req.file.filename)
            body.image = req.file.filename
        }
        if (req.files) {
            body.images = []
            req.files.forEach(e => body.images.push(e.filename))
        }
        console.log("body =====", body)
        
        const movie = await MovieModel.create({
            ...body,
        });
        res.status(201).json({
            status: "success",
            movie,
        });
    } catch (err) {
        console.log("err", err)
        res.status(500).json({
            status: "error",
            err: err
        });
    }
};



exports.getMovie = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                status: "error",
                message: errors.array()[0].msg,
            });
        }
        const movie = await MovieModel.findById(req.params.id).populate("authors");
        if (!movie) {
            res.status(404).json({
                status: "error",
                message: "Book with this ID does not exist",
            });
        }
        res.status(200).json({
            status: "success",
            movie,
        });
    } catch (err) {
        //TODO
    }
};


exports.updateMovie = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                status: "error",
                message: errors.array()[0].msg,
            });
        }
        const movie = await MovieModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            populate: "genres",
        });
        if (!movie) {
            res.status(404).json({
                status: "error",
                message: "movie with this ID does not exist",
            });
        }
        res.status(200).json({
            status: "success",
            movie: movie,
        });
    } catch (err) {
        //TODO
    }
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

exports.deleteMovie = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                status: "error",
                message: errors.array()[0].msg,
            });
        }
        const movie = await MovieModel.findByIdAndDelete(req.params.id);
        if (!movie) {
            res.status(404).json({
                status: "error",
                message: "Book with this ID does not exist",
            });
        }
        res.status(204).json({
            status: "success",
            movie: null,
        });
    } catch (err) {
        //TODO
    }
};