const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

/*

*/

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
           
        },
        description: {
            type: String,
            max: 500,
        },
        year: {
            type: Number,
            min: [0],
            max: 2050,
            
        },

        category: {
            type: String,
            ref: "Category",
        },
        genres: [
            {
                type: String
                
            },
        ],
        image: {
            type: String,
            default: "default.png",
        },
        images: [
            {
                type: String,

            },
        ],
        type: {
            type: String,
            required: true,
        },


    },
    {timestamps: true}
);

schema.plugin(mongoosePaginate);
const ModelMovie = mongoose.model("ModelMovie", schema);
module.exports = ModelMovie
