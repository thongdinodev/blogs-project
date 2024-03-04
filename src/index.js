require("./db/mongoose");
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const blogRoutes = require('./routes/rt-blogs');

const app = express();
const port = process.env.PORT;

// Use engine, public and bodyparser
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

//USE BLOG ROUTERS
app.use(blogRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});