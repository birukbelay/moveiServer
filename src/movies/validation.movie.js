const { body, param } = require("express-validator");
const mongoose = require("mongoose");

/**
 *
 * @param {String} type
 *  |
 */

exports.validate = (type) => {
    switch (type) {
        case "GET":
            return [
                param("id")
                    .custom((value) => {
                        return mongoose.Types.ObjectId.isValid(value);
                    })
                    .withMessage("Invalid book ID"),
            ];
        case "CREATE":
            console.log("000000-------------00")
            return [
                body("title").not().isEmpty().withMessage("movies title is required"),
                body("description")
                    .not()
                    .isEmpty()
                    .withMessage("Book description is required"),
            ];
        case "UPDATE":
            return [
                param("id")
                    .custom((value) => {
                        return mongoose.Types.ObjectId.isValid(value);
                    })
                    .withMessage("Invalid book ID"),
                body("title")
                    .optional()
                    .not()
                    .isEmpty()
                    .withMessage("movie title is required"),
                body("description")
                    .optional()
                    .not()
                    .isEmpty()
                    .withMessage("Book description is required"),
            ];
        case "DELETE":
            return [
                param("id")
                    .custom((value) => {
                        return mongoose.Types.ObjectId.isValid(value);
                    })
                    .withMessage("Invalid book ID"),
            ];

        default:
            return [];
    }
};
