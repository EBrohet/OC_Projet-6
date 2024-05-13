const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/books', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Livre créé !'
    });
});

app.get('/api/books', (req, res, next) => {
    const books = [
        {
            userId: 'qsomihvqios',
            title: 'Mon premier livre',
            author: 'Bernard Werber',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            year: 2000,
            genre: 'science-fiction',
            ratings: [
                {
                    userId: 'qsomihvqios',
                    grade: 4
                }
            ],
            averageRating: 3
          },
          {
            userId: 'qsomihvqios',
            title: 'Mon deuxième livre',
            author: 'Agatha Christie',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            year: 1940,
            genre: 'policier',
            ratings: [
                {
                    userId: 'qsomihvqios',
                    grade: 3
                }
            ],
            averageRating: 3
          },
    ];
    res.status(200).json(books);
});

module.exports = app;