const express = require("express");
const movieController = require("./controller.movie");
const movieValidation = require("./validation.movie");
const { verifyUser } = require("../middelware/auth");
const router = express.Router();
const imageUpload= require("../utils/fileUpload")
/**
 * Routes for handling
 *  - Get All Movies
 *  - Create Movie
 */

router
  .route("/")
  .get(movieController.getAllMovies)
  .post(

      // verifyUser,
    movieValidation.validate("CREATE"),
    imageUpload.uploadSingleImage("movie"),
    movieController.createMovie
);


/**
 * Routes for handling
 *  - Get Single Movie
 *  - Update Movie
 *  - Delete Movie
 */
router
    .route("/:id")
    .get(
        // verifyUser, 
        movieValidation.validate("GET"), movieController.getMovie)
    .put(
        // verifyUser,
        movieValidation.validate("UPDATE"),
        movieController.updateMovie
    )
    .delete(
        // verifyUser,
        movieValidation.validate("DELETE"),
        movieController.deleteMovie
    );


module.exports = router;