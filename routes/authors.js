const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }
})

// New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`/authors`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error Creating Author',
        })
    }
})

//Show Author Route
router.get('/:id',async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})

//Edit Author Route
router.get('/:id/edit',async (req,res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author }) 
    } catch {
        res.redirect('/authors')
    }
})

//Update Author Route
router.put('/:id', async (req,res) => {
    let author
    try {
        author =  await Author.findById(req.params.id)
        if (author.isProtected) {
            return res.redirect(`/authors/${author.id}`) 
        }
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error Updating Author',
            })
        }
    }
})

//Delete Author Route
router.delete('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);

        if (!author) {
            return res.status(404).send('Author not found');
        }

        if (author.isProtected) {
            return res.redirect(`/authors/${author.id}`) 
        }

        // Check for associated books
        const books = await Book.find({ author: author.id });
        if (books.length > 0) {
            return res.status(400).send('Cannot delete author with associated books');
        }

        // Proceed with deletion
        await author.deleteOne();
        res.redirect('/authors');
    } catch (err) {
        res.status(500).send('Error deleting author');
    }
});


module.exports = router