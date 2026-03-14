if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const path = require('path');
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.set('layout',  'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose');

// Validate environment variable
if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is not defined.");
    process.exit(1);
}

mongoose.connect(process.env.DATABASE_URL) // No options needed

const db = mongoose.connection;
db.on('error', error => console.error('Error connecting to MongoDB:', error));
db.once('open', () => console.log('Connected to Mongoose'));


app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    })
}

module.exports = app;