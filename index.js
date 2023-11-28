import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "project",
    password: "123456",
    port: 5432,
  });
  db.connect();

// //Declare global varaiable
let currentId;
let currentBlog;
let isLogToView = false;

// Use engine, public and bodyparser
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//FUNCTION 
async function getCurrentDay() {
    const d = new Date();
    const date = d.toLocaleString();
    return date;
};

async function getBlogs() {
    const result = await db.query("SELECT * FROM blogs ORDER BY id ASC");
    let blogs = [];
    result.rows.forEach((blog) => blogs.push(blog));
    return blogs;
}
////////////////////// GET, POST //////////////////////

//  GET ALL BLOGS, SHOW ALL
app.get("/", async (req, res) => {
    const blogs = await getBlogs();
    res.render("index", {blogs: blogs});
});

//POST BLOG PAGE
app.post("/create", (req, res) => {
    res.render("create");
});

//
app.get("/create", (req, res) => {
    res.render("create");
});

//create blog
app.post("/post-blog", async (req, res) => {
    const inputTitle = req.body.title;
    const inputContent = req.body.content;
    const date = await getCurrentDay();
    try {
        await db.query("INSERT INTO blogs (title, content, date) VALUES ($1, $2, $3)", [inputTitle, inputContent, date]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});


// GET specific Blog view and edit
//VIEW
app.get("/view/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    currentBlog = id;
    isLogToView = false;
    const blogs = await getBlogs();

    currentId = blogs[id].id; // set user current

    res.render("view", {
        blogs: blogs[id],
        isLogToView: isLogToView,
        currentBlog: currentBlog
    });
});



//UPDATE
app.get("/edit/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    currentBlog = id;
    isLogToView = true;

    const blogs = await getBlogs();
    res.render("view", {
        blogs: blogs[id],
        isLogToView: isLogToView
    });
});

// //

//update blog
app.post("/patch-blog", async (req, res) => {
    
    const updateTitle = req.body.title;
    const updateContent = req.body.content;
    const updateDate = await getCurrentDay();
    const updateId = currentId;
    console.log(updateId);
    try {
        await db.query("UPDATE blogs SET title = $1, content = $2, date = $3 WHERE id = $4",[updateTitle, updateContent, updateDate, updateId]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
})

//delete blog
app.post("/delete-blog", async (req, res) => {
    const deleteId = currentId;
    try {
        await db.query("DELETE FROM blogs WHERE id = $1", [deleteId]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

