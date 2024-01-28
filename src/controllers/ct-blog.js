const Blog = require('../models/blog');

// //Declare global varaiable
let idBlogCurrent; // to know blog current is viewed and go to exactly edit blog 
let currentBlog;
let isLogToView = false; // check is viewing or not for going to edit page

// Default data
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

exports.getAllBlogs = async (req, res) => {
    await Blog.find({}).then((foundBlogs) => {
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
    });
};

exports.getSpecificViewBlog = async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(req.params);
    currentBlog = id;
    isLogToView = false;
    const searchId = req.body.blogId;
    idBlogCurrent = req.body.blogId; 
    
    if (searchId) {
        await Blog.findById(searchId).then((blogFound) => {
            console.log(idBlogCurrent);
        res.render("view", {
            blogs: blogFound,
            isLogToView: isLogToView,
            currentBlog: currentBlog
        })
        }).catch((e) => {
            console.log(e);
        });
    } else {
        await Blog.find({}).then((blogFound) => {
            res.render("view", {
                blogs: blogFound[id],
                isLogToView: isLogToView,
                currentBlog: currentBlog
            
        });
        }).catch((e) => {
            console.log(e);
        });
    }
}

exports.getSpecificEditBlog = async (req, res) => {
    const id = parseInt(req.params.id);
    currentBlog = id;
    isLogToView = true;

    await Blog.findById(idBlogCurrent).then((blogFound) => {
        console.log(idBlogCurrent);
        res.render("view", {
            blogs: blogFound,
            isLogToView: isLogToView
        });
    }).catch((err) => {
        console.log(err);
    });
};

exports.getCreateBlog = (req, res) => {
    res.render("create");
};

exports.postCreateBlog = async (req, res) => {
    const inputTitle = req.body.title;
    const inputContent = req.body.content;
    const date = getCurrentDay();
    
    const newBlog = new Blog ({
        title: inputTitle,
        content: inputContent,
        date: getCurrentDay()
    });

    await newBlog.save().then((blog) => {
        console.log('Successfully to add a new blog');
    }).catch((e) => {
        console.log(e);
    });
    res.redirect("/");
};

exports.updateBlog = async (req, res) => {
    
    const updateTitle = req.body.title;
    const updateContent = req.body.content;
    const updateDate = getCurrentDay();
    
    await Blog.findByIdAndUpdate(idBlogCurrent, {$set: {title: updateTitle, content: updateContent, date: updateDate}}).then(() => {
        console.log("Successfully to update blog with id: " + idBlogCurrent);
        res.redirect("/");
    }).catch((err) => {
        console.log(err);
    });
};

exports.deleteBlog = async (req, res) => {
    await Blog.findByIdAndDelete(idBlogCurrent).then((blogFound) => {
        console.log("Delete blog successfully, blog id: " + blogFound._id);
        res.redirect("/");
    }).catch((err) => {
        console.log(err);
    });
};




