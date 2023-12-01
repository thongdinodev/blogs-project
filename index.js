const express = require("express") ;
const bodyParser = require("body-parser") ;
const mongoose = require("mongoose");

const app = express();
const port = 3000;

mongoose.connect("mongodb+srv://admin-thong:Test123@cluster0.rzln4di.mongodb.net/blogsDB").then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

// //Declare global varaiable
let idBlogCurrent;
let currentBlog;
let isLogToView = false;

// Use engine, public and bodyparser
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Schema
const blogsSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: String
});

const Blog = mongoose.model("Blog", blogsSchema);

const blog1 = new Blog({
    title: "I Tried to Impress my Date with my Culinary Skills, and I Burned Water",
    content: "Hey fellow foodies, gather 'round for a tale of culinary calamity that would make Gordon Ramsay shed a tear. So, picture this: a romantic dinner date with my crush, a beautifully set table, candles, and soft music playing in the background. I decided to take charge of the kitchen and show off my alleged culinary skills, thinking I'd impress my date with a homemade meal. What could go wrong, right? As we embarked on this culinary adventure, I decided to start with something easy - boiling water for pasta. Sounds foolproof, doesn't it? But it turns out, I have a knack for defying the odds.",
    date: getCurrentDay()
});

const blog2 = new Blog({
    title: "I Pretended to Be a Penguin on a Job Interview - Now I'm the New Zoo Attraction",
    content: "Hello, my adoring fans! Allow me to regale you with the audacious tale of how my penguin impersonation turned me into the zoo's most celebrated attraction. One day, in a moment of pure genius, I transformed into the charismatic Penguin Pretender. I walked into the zoo, flaunting my exceptional penguin moves, honks, and all. The interview panel was dumbstruck, offering me a job right then and there. Fast forward to today, I'm the star of the show! My skills as the dazzling Penguin Pretender are unrivaled, drawing crowds from all over. I have a VIP enclosure, a daily 'Penguin Spectacle,' and a fervent fan following. My message to you? Dare to be extraordinary, and let your talents shine.",
    date: getCurrentDay()
});

const defaultBlogs = [blog1, blog2];

//FUNCTION 
function getCurrentDay() {
    const d = new Date();
    const date = d.toLocaleString();
    return date;
};


////////////////////// GET, POST //////////////////////

//  GET ALL BLOGS, SHOW ALL
app.get("/", (req, res) => {
    Blog.find({}).then((foundBlogs) => {
        if (foundBlogs.length === 0) {
            Blog.insertMany(defaultBlogs).then(() => {
                console.log("Successfully to add default blogs");
            }).catch((err) => {
                console.log(err);
            });
            res.redirect("/");
        }
        res.render("index", { blogs: foundBlogs});
    }).catch((err) => {
        console.log(err);
    })
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
app.post("/post-blog", (req, res) => {
    const inputTitle = req.body.title;
    const inputContent = req.body.content;
    const date = getCurrentDay();
    
    const newBlog = new Blog ({
        title: inputTitle,
        content: inputContent,
        date: getCurrentDay()
    });

    newBlog.save();
    res.redirect("/");
});


// GET specific Blog view and edit
//VIEW
app.post("/view/:id", (req, res) => {

    const id = parseInt(req.params.id);
    currentBlog = id;
    isLogToView = false;
    const searchId = req.body.blogId;
    idBlogCurrent = req.body.blogId;

    Blog.findById(searchId).then((blogFound) => {
        res.render("view", {
            blogs: blogFound,
            isLogToView: isLogToView,
            currentBlog: currentBlog
        })
    });
});



//UPDATE
app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    currentBlog = id;
    isLogToView = true;

    Blog.findById(idBlogCurrent).then((blogFound) => {
        res.render("view", {
            blogs: blogFound,
            isLogToView: isLogToView
        });
    }).catch((err) => {
        console.log(err);
    });
    
});

// //

//update blog
app.post("/patch-blog", (req, res) => {
    
    const updateTitle = req.body.title;
    const updateContent = req.body.content;
    const updateDate = getCurrentDay();
    
    Blog.findByIdAndUpdate(idBlogCurrent, {$set: {title: updateTitle, content: updateContent, date: updateDate}}).then(() => {
        console.log("Successfully to update blog with id: " + idBlogCurrent);
        res.redirect("/");
    }).catch((err) => {
        console.log(err);
    });
});

//delete blog
app.post("/delete-blog", (req, res) => {
    Blog.findByIdAndDelete(idBlogCurrent).then((blogFound) => {
        console.log("Delete blog successfully, blog id: " + blogFound._id);
        res.redirect("/");
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

