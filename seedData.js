const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');
require('dotenv').config();

const MONGO_URI = process.env.DATABASE_URL;

if (!MONGO_URI) {
    console.error("Missing DATABASE_URL in environment.");
    process.exit(1);
}

// 10 Classic technical & fictional books to give the library a premium look
const seedBooksData = [
    {
        title: "Clean Code",
        authorName: "Robert C. Martin",
        publishDate: "2008-08-01",
        pageCount: 464,
        description: "A Handbook of Agile Software Craftsmanship.",
        coverUrl: "https://covers.openlibrary.org/b/title/Clean%20Code-L.jpg"
    },
    {
        title: "The Pragmatic Programmer",
        authorName: "Andrew Hunt",
        publishDate: "1999-10-20",
        pageCount: 352,
        description: "From Journeyman to Master.",
        coverUrl: "https://covers.openlibrary.org/b/title/The%20Pragmatic%20Programmer-L.jpg"
    },
    {
        title: "1984",
        authorName: "George Orwell",
        publishDate: "1949-06-08",
        pageCount: 328,
        description: "A dystopian social science fiction novel and cautionary tale.",
        coverUrl: "https://covers.openlibrary.org/b/title/1984-L.jpg"
    },
    {
        title: "To Kill a Mockingbird",
        authorName: "Harper Lee",
        publishDate: "1960-07-11",
        pageCount: 281,
        description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
        coverUrl: "https://covers.openlibrary.org/b/title/To%20Kill%20a%20Mockingbird-L.jpg"
    },
    {
        title: "Harry Potter and the Sorcerer's Stone",
        authorName: "J.K. Rowling",
        publishDate: "1997-06-26",
        pageCount: 309,
        description: "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
        coverUrl: "https://covers.openlibrary.org/b/title/Harry%20Potter%20and%20the%20Sorcerer's%20Stone-L.jpg"
    },
    {
        title: "The Great Gatsby",
        authorName: "F. Scott Fitzgerald",
        publishDate: "1925-04-10",
        pageCount: 180,
        description: "A 1925 novel written by American author F. Scott Fitzgerald that follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.",
        coverUrl: "https://covers.openlibrary.org/b/title/The%20Great%20Gatsby-L.jpg"
    },
    {
        title: "Pride and Prejudice",
        authorName: "Jane Austen",
        publishDate: "1813-01-28",
        pageCount: 432,
        description: "Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen.",
        coverUrl: "https://covers.openlibrary.org/b/title/Pride%20and%20Prejudice-L.jpg"
    },
    {
        title: "The Hobbit",
        authorName: "J.R.R. Tolkien",
        publishDate: "1937-09-21",
        pageCount: 310,
        description: "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.",
        coverUrl: "https://covers.openlibrary.org/b/title/The%20Hobbit-L.jpg"
    },
    {
        title: "Design Patterns",
        authorName: "Erich Gamma",
        publishDate: "1994-10-21",
        pageCount: 395,
        description: "Elements of Reusable Object-Oriented Software.",
        coverUrl: "https://covers.openlibrary.org/b/title/Design%20Patterns-L.jpg"
    },
    {
        title: "Refactoring",
        authorName: "Martin Fowler",
        publishDate: "1999-07-08",
        pageCount: 431,
        description: "Improving the Design of Existing Code.",
        coverUrl: "https://covers.openlibrary.org/b/title/Refactoring-L.jpg"
    }
];

async function fetchImageAsBase64(url) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
}

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB database.");

        const authorMap = new Map();

        // 1. Process Authors
        for (const bookInfo of seedBooksData) {
            if (!authorMap.has(bookInfo.authorName)) {
                // Check if the author exists
                let author = await Author.findOne({ name: bookInfo.authorName });
                if (!author) {
                    author = new Author({
                        name: bookInfo.authorName,
                        isProtected: true // Protect demo author
                    });
                    author = await author.save();
                    console.log(`Created Protected Author: ${author.name}`);
                }
                authorMap.set(bookInfo.authorName, author._id);
            }
        }

        // 2. Process Books
        for (const bookInfo of seedBooksData) {
            const authorId = authorMap.get(bookInfo.authorName);

            // Check if book already exists
            const existingBook = await Book.findOne({ title: bookInfo.title });

            if (!existingBook) {
                console.log(`Downloading cover image for: ${bookInfo.title}...`);

                let base64Cover = "";
                let mimeType = 'image/jpeg';
                try {
                    base64Cover = await fetchImageAsBase64(bookInfo.coverUrl);
                } catch(coverFetchErr) {
                    // Fallback to a solid dark teal 1x1 pixel if download fails
                    console.log(`Failed to download cover for ${bookInfo.title}, using fallback placeholder.`);
                    base64Cover = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                    mimeType = 'image/png';
                }

                const newBook = new Book({
                    title: bookInfo.title,
                    author: authorId,
                    publishDate: new Date(bookInfo.publishDate),
                    pageCount: bookInfo.pageCount,
                    description: bookInfo.description,
                    coverImage: Buffer.from(base64Cover, 'base64'),
                    coverImageType: mimeType,
                    isProtected: true // Protect demo book
                });

                await newBook.save();
                console.log(`Successfully created Protected Book: ${newBook.title}`);
            } else {
                console.log(`Book already exists, skipping: ${bookInfo.title}`);
            }
        }

        console.log("Seeding complete!");
        process.exit(0);

    } catch (err) {
        console.error("Seeding procedure failed: ", err);
        process.exit(1);
    }
}

seedDatabase();
