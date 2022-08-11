const mongoose = require("mongoose");
const connection = mongoose.connect("mongodb://localhost:27017/movies");

const moviesSchema = mongoose.Schema({
    "id": Number,
    "title": String,
    "year": Number,
    "genres": [String],
    "ratings": [Number],
    "poster": String,
    "contentRating": Number,
    "duration": String,
    "releaseDate": String,
    "averageRating": Number,
    "originalTitle": String,
    "storyline": String,
    "actors": [String],
    "imdbRating": Number,
    "posterurl": String
})
const moviesModel = mongoose.model("movie", moviesSchema);
module.exports = { connection, moviesModel };