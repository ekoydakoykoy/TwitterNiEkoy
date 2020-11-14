if( process.env.NODE_ENV !== 'production' ){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const methodOverride = require('method-override');
const articleRouter = require('./routes/articles');
const app = express();

const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost/blog';
mongoose.connect(dbUrl, { 
    useNewUrlParser: true, useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to DB'));

/*
const dbUrl = process.env.DATABASE_URL;
mongoose.connect(dbUrl, { 
    useNewUrlParser: true, useUnifiedTopology: true 
 });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to DB'));
*/
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req,res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    });
    
    res.render('articles/index', { articles: articles});
});

app.use('/articles', articleRouter);
app.listen(port, () => console.log(`Server started on port ${port}`));