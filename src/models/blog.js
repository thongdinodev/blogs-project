const mongoose = require('mongoose');

//Schema
const blogsSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: String
});

const Blog = mongoose.model("Blog", blogsSchema);

module.exports = Blog;