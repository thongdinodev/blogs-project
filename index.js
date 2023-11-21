import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let blogs = [];
let currentBlog;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// post constructor
const Blog = function (title, content) {
    this.title = title;
    this.content = content;
    this.rawDate = new Date();
    this.date = this.rawDate.toLocaleString();
};

//FUNCTION
// add Post 
const addBlog = function (title, content) {
    const newBlog = new Blog(title, content);
    blogs.push(newBlog);
};

// delete post
const deleteBlog = function (index) {
    blogs.splice(index, 1);
};

const updateBlog = function (index, newTitle, newContent) {
    blogs[index].title = newTitle;
    blogs[index].content = newContent;
};
////////////////////// GET, POST //////////////////////
app.get("/", (req, res) => {
    res.render("index", {blogs: blogs});
});

// GET specific Blog and can edit
//formaction is important /view/:id
app.get("/view/:id", (req, res) => {
    const id = parseInt(req.params.id);
    currentBlog = id;
    res.render("view", {blogs: blogs[id]});
})

//
app.post("/create", (req, res) => {
    res.render("create");
})


//create blog
app.post("/post-blog", (req, res) => {
    addBlog(req.body.title, req.body.content);
    res.redirect("/");
});

//update blog
app.post("/patch-blog", (req, res) => {
    updateBlog(currentBlog, req.body.title, req.body.content);
    res.redirect("/");
})

//delete blog
app.post("/delete-blog", (req, res) => {
    deleteBlog(currentBlog);
    res.redirect("/");
})

app.listen(port, () => {
    addBlog("1st Blog", "Hello World!");
    console.log(`Server is running on port ${port}`);
});

//get all, get specific, post, update, delete