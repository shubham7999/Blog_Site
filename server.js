const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const port = process.env.PORT || '8000';
// express app
const app = express();

dotenv.config({path : './config.env'})

const dbURI = process.env.DATABASE;


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify : false, useCreateIndex:true })
  .then(result => app.listen(port))
  .catch(err => console.log(err.message));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});