require("../db/mongoose");
const express = require("express") ;
const router = express.Router();
const blogControllers = require('../controllers/ct-blog');
const errorPage = require('../controllers/error')

////////////////////// GET, POST //////////////////////

router.get("/", blogControllers.getAllBlogs);
router.post("/view/:id", blogControllers.getSpecificViewBlog);
router.get("/edit/:id", blogControllers.getSpecificEditBlog);
router.post("/create", blogControllers.getCreateBlog);
router.get("/create", blogControllers.getCreateBlog);
router.post("/post-blog", blogControllers.postCreateBlog);
router.post("/patch-blog", blogControllers.updateBlog);
router.post("/delete-blog", blogControllers.deleteBlog);

router.get('*', errorPage.get404);

module.exports = router;