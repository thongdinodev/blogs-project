import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

//Declare global varaiable
let blogs = [];
let currentBlog;
let isLogToView = false;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// blog constructor
const Blog = function (title, content) {
    this.title = title;
    this.content = content;
    this.rawDate = new Date();
    this.date = this.rawDate.toLocaleString();
};

//FUNCTION

// add blog 
const addBlog = function (title, content) {
    const newBlog = new Blog(title, content);
    blogs.push(newBlog);
};

// delete blog
const deleteBlog = function (index) {
    blogs.splice(index, 1);
};

// update blog 
const updateBlog = function (index, newTitle, newContent) {
    blogs[index].title = newTitle;
    blogs[index].content = newContent;
    const newRawDate = new Date();
    blogs[index].date = newRawDate.toLocaleString();
};


////////////////////// GET, POST //////////////////////
app.get("/", (req, res) => {
    res.render("index", {blogs: blogs});
});

// GET specific Blog view and edit
//VIEW
app.get("/view/:id", (req, res) => {
    const id = parseInt(req.params.id);
    currentBlog = id;
    isLogToView = false;
    res.render("view", {
        blogs: blogs[id],
        isLogToView: isLogToView,
        currentBlog: currentBlog
    });
});

//UPDATE
app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    currentBlog = id;
    isLogToView = true;
    res.render("view", {
        blogs: blogs[id],
        isLogToView: isLogToView
    });
});

//
app.post("/create", (req, res) => {
    res.render("create");
});

//
app.get("/create", (req, res) => {
    res.render("create");
});

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
    addBlog("I Tried to Impress my Date with my Culinary Skills, and I Burned Water", "Hey fellow foodies, gather 'round for a tale of culinary calamity that would make Gordon Ramsay shed a tear. So, picture this: a romantic dinner date with my crush, a beautifully set table, candles, and soft music playing in the background. I decided to take charge of the kitchen and show off my alleged culinary skills, thinking I'd impress my date with a homemade meal. What could go wrong, right? As we embarked on this culinary adventure, I decided to start with something easy - boiling water for pasta. Sounds foolproof, doesn't it? But it turns out, I have a knack for defying the odds.");
    addBlog("I Pretended to Be a Penguin on a Job Interview - Now I'm the New Zoo Attraction", "Hello, my adoring fans! Allow me to regale you with the audacious tale of how my penguin impersonation turned me into the zoo's most celebrated attraction. One day, in a moment of pure genius, I transformed into the charismatic Penguin Pretender. I walked into the zoo, flaunting my exceptional penguin moves, honks, and all. The interview panel was dumbstruck, offering me a job right then and there. Fast forward to today, I'm the star of the show! My skills as the dazzling Penguin Pretender are unrivaled, drawing crowds from all over. I have a VIP enclosure, a daily 'Penguin Spectacle,' and a fervent fan following. My message to you? Dare to be extraordinary, and let your talents shine.");
    console.log(`Server is running on port ${port}`);
});

//get all, get specific, post, update, delete