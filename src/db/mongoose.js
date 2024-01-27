const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin-thong:Test123@cluster0.rzln4di.mongodb.net/blogsDB").then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));